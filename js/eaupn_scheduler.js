class EaUpnScheduler extends Scheduler
{
    constructor(cores, processes)
    {
        super(cores, processes, new EaUpnReadyQueue());
        
        this.e_throughput = 0;
        for(let i=0; i<this.cores.length; ++i){
            let core = this.cores[i];
            if(core instanceof ECore)
                this.e_throughput++;
        }
        this.e_throughput += 1e-7;                   //소수점 연산의 오차 고려
        this.preferP = new EaUpnReadyQueue();
        this.preferE = new EaUpnReadyQueue();

    }



    dispatch_or_preemption_process_to_cores()
    {

        // 긴급에 대하여 정렬을 수행한다.
        // now_time 으로 긴급도를 계산한다.
        // 긴급도는 (deadline - now_time)/remain_time 이며
        // 긴급도가 작을 수록 긴급한 것이다.
        
        // Upn 알고리즘은 빈 코어가 있으면
        // 가장 긴급한 process 를 할당하고
        // 코어가 일하는 중이여도 더 급한 프로세스이면 선점한다.
        for(let i=0;i<this.cores.length;++i)
        {
            let core = this.cores[i];
            if(core.has_process())
            {
                this.ready_queue.push(core.quit());
            }
        }
        let preferE = this.preferE;
        let preferP = this.preferP;

        this.ready_queue.sort(this.now_time);

        while(!this.ready_queue.empty()){
            let p = this.ready_queue.pop();
            if(p.eaupn_urgent_ratio_func(this.now_time) < 1.0){
                preferP.push(p);
            }else{
                preferE.push(p);
            }
        }
        


        //=====================E코어 선호 프로세스들의 요구 스루풋 구하기=================================
        let E_total_demand_throughput = 0;
        let plist = preferE.list();
        for(let i=0; i<plist.length; ++i){
            E_total_demand_throughput += plist[i].demand_throughput_func(this.now_time);    //preferE에 있는 프로세스의 데드라인이 현재시간보다 작을 수 없음
        }
        //=====================E코어 선호 프로세스들의 요구 스루풋 구하기=================================

        //우선 P코어 적합 프로세스들을 가능한한 코어에 할당함
        for(let i=0;i<this.cores.length;++i)
        {
            let core = this.cores[i];
            if(preferP.empty()) break;
            if(!core.has_process())
            {
                core.dispatch(preferP.pop());
            }
        }


        if(E_total_demand_throughput < this.e_throughput){
            for(let i=0;i<this.cores.length;++i)
            {
                let core = this.cores[i];
                if(!(core instanceof ECore)) continue;

                if(preferE.empty()) break;
                if(!core.has_process())
                {
                    core.dispatch(preferE.pop());
                }
            }
        }else{
            for(let i=0;i<this.cores.length;++i)
            {
                let core = this.cores[i];
                if(preferE.empty()) break;
                if(!core.has_process())
                {
                    core.dispatch(preferE.pop());
                }
            }
        }


        while(!preferE.empty()){
            this.ready_queue.push(preferE.pop());
        }

        while(!preferP.empty()){
            this.ready_queue.push(preferP.pop());
        }
        



    }
}
