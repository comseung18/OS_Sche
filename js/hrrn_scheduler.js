class HrrnScheduler extends Scheduler
{
    constructor(cores, processes)
    {
        super(cores, processes, new HrrnReadyQueue());
    }

    dispatch_or_preemption_process_to_cores()
    {
        // 응답률에 대하여 정렬을 수행한다.
        this.ready_queue.sort();

        // Hrrn 알고리즘은 빈 코어가 있으면
        // 응답률이 가장 높은 process 를 할당하고
        // 코어가 일하는 중이면 선점하지 않는다.
        for(let i=0;i<this.cores.length;++i)
        {
            let core = this.cores[i];
            if(!core.has_process() && !this.ready_queue.empty())
            {
                core.dispatch(this.ready_queue.pop());
            }
        }
    }
}
