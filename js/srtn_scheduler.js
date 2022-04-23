class SrtnScheduler extends Scheduler
{
    constructor(cores, processes)
    {
        super(cores, processes, new SrtnReadyQueue());
    }

    dispatch_or_preemption_process_to_cores()
    {
        // Srtn 알고리즘은 빈 코어가 있으면
        // 코어에 남은 실행 시간이 가장 짧은 process 를 할당하고
        // (남은 실행 시간을 기준으로 하는 우선순위큐를 사용하여 구현)
        // 코어가 일하는 중일 때도 우선순위큐의 최상위 프로세스가
        // 더 짧은 남은 실행시간을 가질경우 그 코어에 그 프로세스를 선점한다.
        
        for(let i=0;i<this.cores.length;++i)
        {
            let core = this.cores[i];
           //  if(this.ready_queue.empty() || (core.has_process() &&  this.ready_queue.peek().remain_time <= core.process.remain_time))
           //  {
                if(core.has_process())
                    this.ready_queue.push(core.quit());
          //   }
        }
        
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
