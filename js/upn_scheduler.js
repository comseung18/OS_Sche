class UpnScheduler extends Scheduler
{
    constructor(cores, processes)
    {
        super(cores, processes, new UpnReadyQueue());
    }

    dispatch_or_preemption_process_to_cores()
    {

        // 긴급에 대하여 정렬을 수행한다.
        // now_time 으로 긴급도를 계산한다.
        // 긴급도는 (deadline - now_time)/remain_time 이며
        // 긴급도가 작을 수록 긴급한 것이다.
        // this.ready_queue.sort(this.now_time);
        this.ready_queue.sort(this.now_time);
        // Upn 알고리즘은 빈 코어가 있으면
        // 가장 긴급한 process 를 할당하고
        // 코어가 일하는 중이여도 더 급한 프로세스이면 선점한다.
        for(let i=0;i<this.cores.length;++i)
        {
            let core = this.cores[i];
            if(this.ready_queue.empty()) break;
            if(!core.has_process() || this.ready_queue.peek().urgent_ratio_func(this.now_time) < core.process.urgent_ratio_func(this.now_time))
            {
                if(core.has_process()) this.ready_queue.push(core.quit());
                this.ready_queue.sort(this.now_time);
                core.dispatch(this.ready_queue.pop());
            }
        }
    }
}
