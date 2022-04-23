class RrScheduler extends Scheduler
{
    constructor(cores, processes, quantum_time)
    {
        super(cores, processes, new FcfsReadyQueue());
        this.quantum_time = quantum_time;
    }

    dispatch_or_preemption_process_to_cores()
    {
        // RR 알고리즘은 빈 코어가 있으면
        // 코어에 process 를 할당하며
        // 코어가 일하는 중일 때도 현재 프로세스 실행시간이 Quantum Time보다 크거나 같으면
        // 현재 프로세스를 Ready Queue에 삽입하고 코어에 다음 process를 할당한다.

        for(let i=0;i<this.cores.length;++i)
        {
            let core = this.cores[i];
            if(core.has_process() && core.processed_time >= this.quantum_time)
            {
                this.ready_queue.push(core.quit());
            }
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
