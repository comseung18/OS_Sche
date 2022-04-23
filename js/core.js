class Core
{
    constructor(power_consumption_per_sec, work_per_sec)
    {
        this.power_consumption_per_sec = power_consumption_per_sec; //코어의 전력 소비량
        this.work_per_sec = work_per_sec; //코어가 초당 실행할 수 있는 일의 양
        this.process = null; // 프로세스가 선점 중인 프로세스
        this.total_power_consumption = 0; //현재까지 총 전력 소비량
        this.processed_time = 0; //할당된 프로세스를 연속으로 처리한 시간

        this.processed_list = []; // 지금 까지 처리한 프로세스의 목록. 간트차트 출력용
    }
    //할당된 프로세스를 수행
    work()
    {
        this.total_power_consumption += this.power_consumption_per_sec;
        this.process.power_consumption += this.power_consumption_per_sec;
        this.process.remain_time = Math.max(this.process.remain_time-this.work_per_sec, 0);
        this.processed_time++;
        this.processed_list[this.processed_list.length-1].processed_time++;

        return this.process.remain_time == 0;
    }
    //할당된 프로세스가 없을 경우 유휴
    idle()
    {
        if(this.processed_list.length == 0 || this.processed_list[this.processed_list.length-1].process_name != "")
        {
            this.processed_list.push({
                processed_time : 0,
                process_name : "",
                process_color : '#ffffff',
                process_complement_color :'#000000',
            });
        }
        this.processed_list[this.processed_list.length-1].processed_time++;

        this.total_power_consumption += 0.1;
    }
    //코어 프로세스를 할당
    dispatch(process)
    {
        this.process = process;
        this.processed_time = 0;

        if(this.processed_list.length == 0 || this.processed_list[this.processed_list.length-1].process_name != process.name){
            this.processed_list.push({
                processed_time : 0,
                process_name : process.name,
                process_color : process.color,
                process_complement_color : process.complement_color,
            })
        }
        
    }
    //코어가 할당 되었는지 확인
    has_process()
    {
        return this.process != null;
    }
    //코어에 할당된 작업을 해제하고 반환
    quit()
    {
        let tmp = this.process;
        this.process = null;
        return tmp;
    }
}