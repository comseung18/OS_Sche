$(document).on("keydown", "form", function(event) { 
    return event.key != "Enter";
});

// 프로세스의 도착시간 기준 오름차정렬을 할 때 사용하는 함수
// 도착 시간 같을 경우 burst 타임 오름차 순으로 정렬
function compare_process_arrival_time(p1, p2)
{
    x = Number(p1.arrival_time);
    y = Number(p2.arrival_time);
    if(x != y)
    {
        if(x < y) return -1;
        else if(x == y) return 0;
        return 1;
    }
    x = Number(p1.burst_time);
    y = Number(p2.burst_time);
    if(x < y) return -1;
    else if(x==y) return 0;
    return 1;
}

// ready_queue ( 추상 클래스 ) 
// push_process
// pop_process

// fcfs_ready_queue
// rr_ready_queue ( ready_queue 상속 )
// push_process
// pop_process

// hrrn_ready_queue

// spn_ready_queue
// 우선순위큐

// srtn_ready_queue
// 우선 순위큐


//////////////////////////////////////////

// cpu ( 추상 클래스 )
// 소비전력, 처리 단위, 가지고 있는 프로세스 참조
// 현재 까지 소비한 전력
// work ( 1초단위 일 )
// 참조한 프로세서의 remaintime 을 감소시키고
// 
// idle


// e_core ( cpu 상속 )
// 재정의

// p_core ( cpu 상속 )
// 재정의

////////////////////////////////////////////
// 현재 시간을 time 이라고 하자.
// 1. arrival time <= time 인 프로세스를 레디큐에 push 한다.
// 2. 프로세스가 코어가 할당되거나 선점된다.
// 2-1. 일할 수 있는 프로세서가 없으면? 2과정은 생략
// 3. 코어가 일을 한다.
// 4. 시간이 증가한다.

/////////////////////////////////////////////
// 간트차트 ?
// ||time ---}}-0------5--------10------||----------------------------------------
// ||Core0{P}}} [--P1--][-P2-][----P1----]-||-------------------------
// ||Core1{P}}} [--P3--][-P4-][----P5----]-||-----------------
// ||Core2{E}}} [--P1--][-P2-][----P1----]-||----------------
// ||Core3{E}}} [--P1--][-P2-][----P1----]-||----------------


// 랜덤 컬러 ( 파스톤 )를 생성하여 '#******' 꼴로 반환하는 함수
function generate_random_color() {
    let color = "#";
    for (let i = 0; i < 3; i++)
      color += ("0" + Math.floor(((1 + Math.random()) * Math.pow(16, 2)) / 2).toString(16)).slice(-2);
    return color;
}

// '#******' 형태의 색상에 대하여 보색을 구하여 '#******' 의 꼴로 반환하는 함수
function cal_complement_color(color)
{
    
    let complement = 0xffffff ^ parseInt(color.substr(1), 16);
    complement = complement.toString(16);
    while(complement.length < 6) complement = "0" + complement;
    return "#" + complement;
}

// 프로세스에 대해 추상화
class Process
{
    constructor(arrival_time, burst_time)
    {
        this.name = "";
        this.arrival_time = arrival_time; // 프로세스 도착시각
        this.burst_time = burst_time; // 프로세스 실행시간
        this.turnaround_time = -1; // 프로세스 종료시각
        this.power_consumption = 0; // 프로세스 소비전력
        this.color = generate_random_color(); // 프로세스 지정 컬러
        this.waiting_time = 0; //프로세스 대기시간
        this.remain_time = burst_time; //프로세스 남은 실행시간
        this.complement_color = cal_complement_color(this.color); // 프로세스 지정 컬러의 보색
    }

    reset()
    {
        this.turnaround_time = -1;
        this.remain_time = this.burst_time;
        this.power_consumption = 0;
    }
}

// 뷰 객체
const app = new Vue({
    el : "#app",
    data:{
        max_time : 0, // 슬라이더 최종 시간, 결과 나오기 전에는 0
        interval_term : 500,

        algorithm : 'FCFS', // 현재 선택된 알고리즘 방식
        quantum_time : 1, // RR 일경우 퀀텀타임
        total_cores : 1, // 총 코어의 개수
        p_cores : 1, // 총 코어 중 p 코어의 개수


        processes : [], // 프로세스 목록을 구성 할 때 사용하는 프로세스 리스트, 도착시간으로 정렬된 상태를 유지함
        
        arrival_time: 0, // 도착시간 입력용 바인딩 변수
        burst_time: 1, // 실행시간 입력용 바인딩 변수

        time : 0, // 슬라이더 현재 진행 중인 시간
        running: false, // 현재 스케쥴링이 진행중인지
        // 0 이면 시작안함, 1 이면 실행 중, 2 이면 실행 중지, 3 이면 실행 완료

        run_timer: null, // 슬라이더 진행 중이면 timer 가 대입됨

        scheduler: new FcfsScheduler(), // 스케쥴링을 진행하는 개체
        cores : [new PCore()], // 코어 개체

        
    },
    watch:{
        total_cores : function(hook)
        {
            cores = [];
            for(let i=0;i<Number(this.p_cores);++i)
            {
               cores.push(new PCore());
            }
            for(let i=0;i<Number(this.total_cores) - Number(this.p_cores);++i)
            {
                cores.push(new ECore());
            }
            this.cores = cores;
        },
        p_cores : function(hook)
        {
            cores = [];
            for(let i=0;i<Number(this.p_cores);++i)
            {
               cores.push(new PCore());
            }
            for(let i=0;i<Number(this.total_cores) - Number(this.p_cores);++i)
            {
                cores.push(new ECore());
            }
            this.cores = cores;
        }
    },
    
    computed:{
        //프로그램 상태
        program_state()
        {
            if(this.running == 0) return "Start!";
            else if(this.running == 1) return "Running!";
            else if(this.running == 2) return "Paused!";
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

        // css 에서 각 코어의 높이
        core_height()
        {
            return this.gantte_height/(Number(this.total_cores)+1);
        },

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
            for(let i=0;i<Number(this.p_cores);++i)
            {
                this.cores.push(new PCore());
            }
            for(let i=0;i<Number(this.total_cores) - Number(this.p_cores);++i)
            {
                this.cores.push(new ECore());
            }
            // 스케쥴러 생성
            if(this.algorithm == 'FCFS') this.scheduler = new FcfsScheduler(this.cores, this.processes);
            else if(this.algorithm == 'RR') this.scheduler = new RrScheduler(this.cores, this.processes, Number(this.quantum_time));
            else if(this.algorithm == 'SPN') this.scheduler = new SpnScheduler(this.cores, this.processes);
            else if(this.algorithm == 'SRTN') this.scheduler = new SrtnScheduler(this.cores, this.processes);

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

            this.processes.push(new Process(Number(this.arrival_time), Number(this.burst_time)));
            this.arrival_time = 0;
            this.burst_time = 1;
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
        }
    }
});