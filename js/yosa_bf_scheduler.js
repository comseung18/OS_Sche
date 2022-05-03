class YosaBfScheduler extends Scheduler
{
    constructor(cores, processes)
    {
        super(cores, processes, new FcfsReadyQueue());

        this.cost = Number.MAX_VALUE; // 두 스케쥴링의 데드라인이 같으면 더 적게 전기를 쓴 스케쥴이 좋다.
        this.deadline_sum = Number.MAX_VALUE; // 데드라인을 지키지 못한 시각, 제일 우선적으로 고려된다.
        this.dfs([], 0); // 전수조사 실행
    }

    // idx 번째 프로세서를 각기 다른 코어에 할당해보면서
    // 할당이 다 끝났을 때 각 코어가 실제로 그러한 스케쥴링을 했을 때
    // this.cost 보다 그 값이 낮고 데드라인을 만족하면 프로세스에 그 결과를 저장한다.
    // v[i] 는 i 번째 프로세스가 할당된 코어의 번호이다.
    dfs(v, idx)
    {
        // 할당을 다 끝냈으면 v 의 결과대로 스케쥴링 해본다.
        if(idx == this.processes.length)
        {
            let ret = 0; // 데드라인을 지키지 못한 총 시간
            let watt = 0; // 총 소비전력

            let end_time = []; // 각 코어가 일을 끝낸 시간
            // 프로세스는 테이블에서 도착 시간에 대해 정렬되어 주어지므로
            // 주어진 프로세스를 순차적으로 실행해야 각 코어가 일을 가장 빠르게 끝낼 수 있다.
            // end_time[c] 는 c 코어가 일을 끝낸 시간이다.
            for(let i=0;i<this.cores.length;++i) end_time.push(0);

            for(let i=0;i<this.processes.length;++i)
            {
                let process = this.processes[i];
                let core = this.cores[v[i]];

                // process 는 v[i] 에 해당하는 코어에 할당된다.
                // end_time[v[i]] 은 해당 코어가 일을 끝낸 시각이다.
                if(end_time[v[i]] < process.arrival_time )
                {
                    // 이 경우 v[i] 코어가 해당 시간까지 쉬게 된다.
                    watt += core.idle_power_consumption*(process.arrival_time-end_time[v[i]]);

                    // 쉬었으니 end_time 이 바뀐다.
                    end_time[v[i]] = process.arrival_time;
                }
                // process 를 처리했을 때 데드라인을 지키지 못한 시간만큼 ret 에 더해진다.
                watt += core.power_consumption_per_sec*(process.burst_time/core.work_per_sec);
                end_time[v[i]] += Math.ceil(process.burst_time/core.work_per_sec);
                if(end_time[v[i]] > process.deadline)
                {
                    ret += end_time[v[i]] - process.deadline;
                }
                    
                
            }
            // 최종적으로 마지막으로 끝나는 프로세서를 기다리는 대기전력이 든다.
            let t_max = 0;
            for(let i=0;i<this.cores.length;++i)
                if(t_max < end_time[i]) t_max = end_time[i];
            
            for(let i=0;i<this.cores.length;++i)
            {
                let core = this.cores[i];
                watt += core.idle_power_consumption*(t_max - end_time[i]);
            }

            // 시뮬레이션 한 결과 데드라인을 더 잘 지켜졌으면?
            if(ret < this.deadline_sum || (ret == this.deadline_sum && watt < this.cost))
            {
                this.deadline_sum = ret;
                this.cost =  watt;
                // 프로세스에 어느 코어에 할당되어야 하는가를 저장
                // assign_to
                for(let i=0;i<idx;++i)
                {
                    this.processes[i].assign_to = v[i];
                }
            }
            return;
        }

        for(let i=0;i<this.cores.length;++i)
        {
            v.push(i);
            this.dfs(v, idx+1);
            v.pop();
        }
    }

    dispatch_or_preemption_process_to_cores()
    {
        // 미리 dfs 를 돌려놓아서 전수조사로 어느 프로세서가
        // 어느 프로세서에 할당되어야 하는지를 구해 놓은 후
        // 프로세서가 가야하는 코어가 비어 있으면 할당한다.
        // process 의 assign_to 멤버가 그 값을 가지고 있다.
        for(let i=0;i<this.cores.length;++i)
        {
            let core = this.cores[i];
            if(!core.has_process() && !this.ready_queue.empty())
            {
                // ready_queue 에서 i 코어에 할당되어야 하는 프로세스를 찾은 뒤
                // 할당한다.
                let procs = this.ready_queue.list();
                for(let j=0;j<procs.length;++j)
                {
                    let process = procs[j];
                    if(process.assign_to == i)
                    {

                        core.dispatch(this.ready_queue.pop_idx(j));
                        break;
                    }
                } 
            }
        }
    }
}