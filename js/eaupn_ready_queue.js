class EaUpnReadyQueue extends ReadyQueue{

    constructor()
    {
        super();
        this.items = [];
    }

    is_less_than(p1, p2)
    {
        let r1 = p1.urgent_ratio;
        let r2 = p2.urgent_ratio;

        if(r1 != r2)
        {
            if(r1 < r2) return -1;
            else return 1;
        }

        if(p1.deadline < p2.deadline) return -1;
        else if(p1.deadline > p2.deadline) return 1;

        if(p1.arrival_time < p2.arrival_time) return -1;
        else if(p1.arrival_time > p2.arrival_time) return 1;

        if(p1.burst_time < p2.burst_time) return -1;
        else if(p1.burst_time > p2.burst_time) return 1;

        return 0;
    }

    sort(now_time)
    {
        let tmp_list = this.list();
        for(let i=0;i<tmp_list.length;++i)
        {
            let process = tmp_list[i];
            process.urgent_ratio = process.eaupn_urgent_ratio_func(now_time);
        }
        this.items.sort(this.is_less_than);
    }

    

    push(process)
    {
        this.items.push(process);
    }

    pop()
    {
        let tmp = this.peek();
        this.items.splice(0, 1);
        return tmp;
    }

    peek()
    {
        return this.items[0];
    }

    empty()
    {
        return this.items.length == 0;
    }

    list()
    {
        return this.items;
    }


}


