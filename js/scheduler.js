class Scheduler
{

    constructor(cores, processes, ready_queue)
    {
        this.now_time = 0;
        this.processes = processes;
        this.cores = cores;
        this.ready_queue = ready_queue;
        this.processed_num = 0;
    }

    // 1. 현재 도착한 프로세스를 레디큐에 넣는다.
    push_process_to_ready_queue()
    {
        for(let i=0;i<this.processes.length;++i)
        {
            let process = this.processes[i];
            if(process.arrival_time == this.now_time)
            {
                this.ready_queue.push(process);
            }
        }
    }

    // 2. 프로세스가 코어에 할당되거나 선점된다.
    dispatch_or_preemption_process_to_cores()
    {

    }

    // 3. 코어가 일을 한다.
    run_core()
    {
        for(let i=0;i<this.cores.length;++i)
        {
            let core = this.cores[i];
            if(core.process)
            {
                if(core.work())
                {
                    let terminated_proc = core.process;
                    core.process = null;

                    terminated_proc.turnaround_time = this.now_time+1 - terminated_proc.arrival_time;
                    this.processed_num++;
                }
            } 
            else core.idle();
        }
    }

    // 레디큐에 대한 스냅샷 저장
    ready_queue_save()
    {
        this.ready_queue.snapshot_add();
    }

    run_sec()
    {
        // 1초 만큼 스케쥴링한다.
        this.push_process_to_ready_queue();
        this.ready_queue_save();
        this.dispatch_or_preemption_process_to_cores();
        
        this.run_core();
        this.now_time++;
    }
}