class SpnScheduler extends Scheduler
{
    constructor(cores, processes)
    {
        super(cores, processes, new SpnReadyQueue());
    }

    dispatch_or_preemption_process_to_cores()
    {
        // Spn 알고리즘은 빈 코어가 있으면
        // 코어에 실행시간이 가장 짧은 process 를 할당하고
        // (실행시간을 기준으로 하는 우선순위큐를 사용하여 구현)
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
