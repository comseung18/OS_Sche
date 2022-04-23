class ReadyQueue
{
    constructor()
    {
        this.time_snapshot = [[]];
    }

    // 프로세스를 큐에 푸쉬
    push(process) 
    {
        
    }

    // 가장 앞에 있는 프로세스를 뽑아서 반환
    pop()
    {

    }

    // 가장 앞에 있는 프로세스를 보여줌.
    peek()
    {

    }

    // 큐가 비어있는지?
    empty()
    {

    }

    // 뷰에서 순회용 리스트를 반환
    list()
    {
        
    }


    // 현재 list 상태를 저장
    snapshot_add()
    {
        let tmp = [];
        let now_list = this.list();
        for(let i=0;i<now_list.length;++i)
        {
            tmp.push(now_list[i].copy());
        }
        this.time_snapshot.push(tmp);
    }

    // time 시간 때의 레디 큐 상태를 반환
    snapshot(time)
    {
        // if(time == maxtime) return this.list();
        return this.time_snapshot[time];
    }
}