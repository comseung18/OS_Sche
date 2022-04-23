class Core
{
    constructor(power_consumption_per_sec, work_per_sec)
    {
        this.power_consumption_per_sec = power_consumption_per_sec;
        this.work_per_sec = work_per_sec;
        this.process = null; // 프로세스가 선점 중인 프로세스
        this.total_power_consumption = 0;
        this.processed_time = 0;

        this.processed_list = []; // 지금 까지 처리한 프로세스의 목록. 간트차트 출력용
    }

    work()
    {
        this.total_power_consumption += this.power_consumption_per_sec;
        this.process.power_consumption += this.power_consumption_per_sec;
        this.process.remain_time = Math.max(this.process.remain_time-this.work_per_sec, 0);
        this.processed_time++;
        this.processed_list[this.processed_list.length-1].processed_time++;

        return this.process.remain_time == 0;
    }

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

    dispatch(process)
    {
        this.process = process;
        this.processed_time = 0;

        this.processed_list.push({
            processed_time : 0,
            process_name : process.name,
            process_color : process.color,
            process_complement_color : process.complement_color,
        })
    }

    has_process()
    {
        return this.process != null;
    }

    quit()
    {
        let tmp = this.process;
        this.process = null;
        return tmp;
    }
}