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
    return "#000000";
    let complement = 0xffffff ^ parseInt(color.substr(1), 16);
    complement = complement.toString(16);
    while(complement.length < 6) complement = "0" + complement;
    return "#" + complement;
}

// 프로세스에 대해 추상화
class Process
{
    constructor(arrival_time, burst_time, deadline =Number.MAX_SAFE_INTEGER)
    {
        this.name = "";
        this.arrival_time = arrival_time; // 프로세스 도착시각
        this.burst_time = burst_time; // 프로세스 실행시간
        this.turnaround_time = -1; // 프로세스 응답시각
        this.power_consumption = 0; // 프로세스 소비전력
        this.color = generate_random_color(); // 프로세스 지정 컬러
        this.remain_time = burst_time; //프로세스 남은 실행시간
        this.serviced_time = 0; // 서비스 받은 시간
        this.complement_color = cal_complement_color(this.color); // 프로세스 지정 컬러의 보색
        this.deadline = deadline;
    }

    // 데드라인을 얼마나 넘었는지
    get dead_exceed_amount()
    {
        if(this.turnaround_time == -1) return '-';
        return Math.max(this.arrival_time + this.turnaround_time - this.deadline, 0);
    }

    get waiting_time()
    {
        return this.turnaround_time - this.serviced_time;
    }

    urgent_ratio_func(time)
    {
        return (this.deadline-time-1)/this.remain_time;
    }
    
    eaupn_urgent_ratio_func(time)
    {
        return (this.deadline-time)/this.remain_time;
    }

    demand_throughput_func(time)
    {
            return this.remain_time / (this.deadline-time);
    }

    reset()
    {
        this.turnaround_time = -1;
        this.remain_time = this.burst_time;
        this.power_consumption = 0;
        this.serviced_time = 0; // 서비스 받은 시간
    }

    // 레디큐 스냅샷 저장용 딥카피
    copy()
    {
        let ret = new Process(0, 0);
        ret.name = this.name;
        ret.color = this.color;
        ret.complement_color = this.complement_color;
        return ret;
    }
}