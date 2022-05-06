$(document).on("keydown", "form", function(event) { 
    return event.key != "Enter";
});




// 뷰 객체
const app = new Vue({
    el : "#app",
    data:{
        max_time : 0, // 슬라이더 최종 시간, 결과 나오기 전에는 0
        interval_term : 500,

        algorithm : 'FCFS', // 현재 선택된 알고리즘 방식
        quantum_time : 1, // RR 일경우 퀀텀타임
        total_cores : 1, // 총 코어의 개수
        deadline : 0,
        p_cores : 0, // 총 코어 중 p 코어의 개수


        processes : [], // 프로세스 목록을 구성 할 때 사용하는 프로세스 리스트, 도착시간으로 정렬된 상태를 유지함
        
        arrival_time: 0, // 도착시간 입력용 바인딩 변수
        burst_time: 1, // 실행시간 입력용 바인딩 변수

        time : 0, // 슬라이더 현재 진행 중인 시간
        running: false, // 현재 스케쥴링이 진행중인지
        // 0 이면 시작안함, 1 이면 실행 중, 2 이면 실행 중지, 3 이면 실행 완료

        run_timer: null, // 슬라이더 진행 중이면 timer 가 대입됨

        scheduler: new FcfsScheduler(), // 스케쥴링을 진행하는 개체
        cores : [new ECore()], // 코어 개체

        is_p_core_first : false, // 빈 코어가 여러개 일 때 P 와 E 코어 둘 중 어느코어를 우선할지
    },
    watch:{
        total_cores : function(hook)
        {
            cores = [];
            if(this.is_p_core_first)
            {
                for(let i=0;i<Number(this.p_cores);++i)
                {
                    cores.push(new PCore());
                }
            }
            for(let i=0;i<Number(this.total_cores) - Number(this.p_cores);++i)
            {
                cores.push(new ECore());
            }
            if(!this.is_p_core_first)
            {
                for(let i=0;i<Number(this.p_cores);++i)
                {
                    cores.push(new PCore());
                }
            }
            this.cores = cores;
        },
        p_cores : function(hook)
        {
            cores = [];
            if(this.is_p_core_first)
            {
                for(let i=0;i<Number(this.p_cores);++i)
                {
                    cores.push(new PCore());
                }
            }
            for(let i=0;i<Number(this.total_cores) - Number(this.p_cores);++i)
            {
                cores.push(new ECore());
            }
            if(!this.is_p_core_first)
            {
                for(let i=0;i<Number(this.p_cores);++i)
                {
                    cores.push(new PCore());
                }
            }
            this.cores = cores;
        }
    },
    
    computed:{
        //프로그램 상태
        program_state()
        {
            if(this.running == 0) return "Start!";
            else if(this.running == 1) return "Running!/Pause?";
            else if(this.running == 2) return "Paused!/Resume?";
            else if(this.running == 3) return "Restart?";
        },

        program_state_class()
        {
            if(this.running == 0) return ["btn-success"];
            else if(this.running == 1) return ["btn-success"];
            else if(this.running == 2) return ["btn-warning"];
            else if(this.running == 3) return ["btn-primary"];
        },

        gantte_height()
        {
            return document.getElementById("bottom-gantt-chart").clientHeight;
        },

        total_cores_power_consumption()
        {
            let ret = 0;
            for(let i=0;i<this.cores.length;++i)
            {
                ret += this.cores[i].total_power_consumption;
            }
            return ret;
        }

    }
    ,
    methods:{
        // Start! 버튼이 클릭되면 실행되는 함수
        start_btn_clicked()
        {
            // 슬라이더가 동작 중 인지 여부에 따라서 분기

            if(this.running == 0)
            {
                this.running = 1;
                this.start();
            }
            else if(this.running == 1)
            {
                this.running = 2;
                clearInterval(this.run_timer);
            }
            else if(this.running == 2)
            {
                this.running = 1;
                this.run_timer = setInterval(this.run, Number(this.interval_term));
            }
            else if(this.running == 3)
            {
                this.reset_for_restart();
                this.start_btn_clicked();
            }
        },

        // 슬라이더 동작 
        start()
        {
            this.cores = [];
            // 코어 생성
            if(this.is_p_core_first)
            {
                for(let i=0;i<Number(this.p_cores);++i)
                {
                    this.cores.push(new PCore());
                }
            }
            for(let i=0;i<Number(this.total_cores) - Number(this.p_cores);++i)
            {
                this.cores.push(new ECore());
            }
            if(!this.is_p_core_first)
            {
                for(let i=0;i<Number(this.p_cores);++i)
                {
                    this.cores.push(new PCore());
                }
            }
            // 스케쥴러 생성
            if(this.algorithm == 'FCFS') this.scheduler = new FcfsScheduler(this.cores, this.processes);
            else if(this.algorithm == 'RR') this.scheduler = new RrScheduler(this.cores, this.processes, Number(this.quantum_time));
            else if(this.algorithm == 'SPN') this.scheduler = new SpnScheduler(this.cores, this.processes);
            else if(this.algorithm == 'SRTN') this.scheduler = new SrtnScheduler(this.cores, this.processes);
            else if(this.algorithm == 'HRRN') this.scheduler = new HrrnScheduler(this.cores, this.processes);
            else if(this.algorithm == 'YOSA_BF') this.scheduler = new YosaBfScheduler(this.cores, this.processes);
            else if(this.algorithm == 'YOSA_UPN') this.scheduler = new UpnScheduler(this.cores, this.processes);
            else if(this.algorithm == 'YOSA_EAUPN') this.scheduler = new EaUpnScheduler(this.cores, this.processes);

            this.run_timer = setInterval(this.run, Number(this.interval_term));
        },

        // 슬라이더가 동작할 때 1초 마다 호출 되는 함수
        run()
        {
            // 모든 프로세스를 처리하면 종료
            if(this.scheduler.processed_num >= this.processes.length)
            {
                this.running = 3;
                clearInterval(this.run_timer);
                return;
            }
            this.scheduler.run_sec();
             // 슬라이더의 시간을 증가시키기
            this.time = this.scheduler.now_time;
            this.max_time = this.scheduler.now_time;

            let gatte = document.getElementById('bottom-gantt-chart');
            gatte.scrollLeft = gatte.scrollWidth;
        },

        // RESET 버튼이 클릭되면 호출되는 함수
        reset()
        {
            this.reset_for_restart();
        },

        reset_for_restart()
        {
            this.time = 0;
            this.running = 0;
            if(this.run_timer) clearInterval(this.run_timer);

            this.scheduler = new FcfsScheduler(); // 스케쥴링을 진행하는 개체
            for(let i=0;i<this.processes.length;++i)
            {
                let proc = this.processes[i];
                proc.reset();
            }
            for(let i=0;i<this.cores.length;++i)
            {
                this.cores[i].processed_list = [];
            }
        },

        // 프로세스 테이블 리셋버튼이 클릭되면 호출되는 함수
        only_table_reset()
        {
            if(this.running != 0 && this.running != 3) return;
            this.processes = [];
        },

        // 프로세스 테이블 내에 프로세스 1개만 지울 때 호출되는 함수
        process_table_process_remove(index)
        {
            // console.log(index);
            this.processes.splice(index,1);
            this.process_naming();
        },

        // Process Add 를 클릭했을 때 호출되는 함수
        process_add()
        {
            if(this.running != 0 && this.running != 3) return;
            this.process_add_by_param(Number(this.arrival_time), Number(this.burst_time), Number(this.deadline));
            this.arrival_time = 0;
            this.burst_time = 1;
        },

        process_add_by_param(arrival_time, burst_time, deadline=Number.MAX_SAFE_INTEGER)
        {
            if(this.running != 0 && this.running != 3) return;
            this.processes.push(new Process(arrival_time, burst_time, deadline));
            this.processes.sort(compare_process_arrival_time);
            this.process_naming();
        },

        //프로세스 네이밍(p1, p2, ...)
        process_naming()
        {
            for(let i=0;i<this.processes.length;++i)
            {
                let process = this.processes[i];
                process.name = "P" + (i+1);
            }
        },
    }
});