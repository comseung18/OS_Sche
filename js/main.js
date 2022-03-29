// 프로세스의 도착시간 기준 오름차정렬을 할 때 사용하는 함수
function compare_process_arrival_time(p1, p2)
{
    x = Number(p1.arrival_time);
    y = Number(p2.arrival_time);
    if(x < y) return -1;
    else if(x==y) return 0;
    return 1;
}

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
        this.arrival_time = arrival_time; // 프로세스 도착시각
        this.burst_time = burst_time; // 프로세스 실행시간
        this.turnaround_time = -1; // 프로세스 종료시각
        this.power_consumption = 0; // 프로세스 소비전력
        this.color = generate_random_color(); // 프로세스 지정 컬러
        this.complement_color = cal_complement_color(this.color); // 프로세스 지정 컬러의 보색
    }
}

// 뷰 객체
const app = new Vue({
    el : "#app",
    data:{
        max_time : 0, // 슬라이더 최종 시간, 결과 나오기 전에는 0


        algorithm : 'FCFS', // 현재 선택된 알고리즘 방식
        quantum_time : 1, // RR 일경우 퀀텀타임
        total_cores : 1, // 총 코어의 개수
        p_cores : 1, // 총 코어 중 p 코어의 개수


        processes : [], // 프로세스 목록을 구성 할 때 사용하는 프로세스 리스트, 도착시간으로 정렬된 상태를 유지함
        
        arrival_time: 0, // 도착시간 입력용 바인딩 변수
        burst_time: 1, // 실행시간 입력용 바인딩 변수

        time : 0, // 슬라이더 현재 진행 중인 시간
        running: false, // 슬라이더가 진행 중인지?
        run_timer: null, // 슬라이더 진행 중이면 timer 가 대입됨

    },
    computed:{

    }
    ,
    methods:{
        // Start! 버튼이 클릭되면 실행되는 함수
        start_btn_clicked()
        {
            // 슬라이더가 동작 중 인지 여부에 따라서 분기

            if(!this.running)
            {
                this.running = true;
                this.start();
            }
            else
            {
                this.running = false;
                clearInterval(this.run_timer);
            }
        },

        // 슬라이더 동작 
        start()
        {
            this.run_timer = setInterval(this.run, 1000);
        },

        // 슬라이더가 동작할 때 1초 마다 호출 되는 함수
        run()
        {
           
            this.time = Number(this.time);

            // 슬라이더가 끝에 도달하면 종료
            if(this.time >= this.max_time)
            {
                this.running = false;
                clearInterval(this.run_timer);
                return;
            }

             // 슬라이더의 시간을 증가시키기
            this.time += 1;
            
        },

        // RESET 버튼이 클릭되면 호출되는 함수
        reset()
        {
            this.algorithm = 'FCFS';
            this.quantum_time = 1;
            this.total_cores = 1;
            this.p_cores = 1;

            this.processes = [];

            this.arrival_time = 0;
            this.burst_time = 1;

            this.time = 0;
            this.running = false;
            if(this.run_timer) clearInterval(this.run_timer);

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
        },

        // Process Add 를 클릭했을 때 호출되는 함수
        process_add()
        {
            if(this.running) return;

            this.processes.push(new Process(Number(this.arrival_time), Number(this.burst_time)));
            this.arrival_time = 0;
            this.burst_time = 1;
            this.processes.sort(compare_process_arrival_time);
        },
    }
});