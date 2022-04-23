class FcfsScheduler extends Scheduler
{
    constructor(cores, processes)
    {
        super(cores, processes, new FcfsReadyQueue());
    }

    dispatch_or_preemption_process_to_cores()
    {
        // fcfs 알고리즘은 빈 코어가 있으면
        // 코어에 process 를 할당하고
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
