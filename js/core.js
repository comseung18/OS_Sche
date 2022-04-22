class Core
{
    constructor(power_consumtion_per_sec, work_per_sec)
    {
        this.power_consumtion_per_sec = power_consumtion_per_sec;
        this.work_per_sec = work_per_sec;
        this.process = null; // 프로세스가 선점 중인 프로세스
        this.total_power_consumtion = 0;
    }

    work()
    {
        this.process.remain_time = Math.max(this.process.remain_time-this.work_per_sec, 0);
        this.total_power_consumtion += this.power_consumtion_per_sec;
        this.process.power_consumption += this.power_consumtion_per_sec;
        return this.process.remain_time == 0;
    }

    idle()
    {
        this.total_power_consumtion += 0.1;
    }

    dispatch(process)
    {
        this.process = process;
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