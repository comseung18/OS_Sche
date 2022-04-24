class HrrnReadyQueue extends ReadyQueue{

    is_less_than(p1, p2)
    {
        let r1 = (p1.waiting_time+p1.burst_time)/p1.burst_time;
        let r2 = (p2.waiting_time+p2.burst_time)/p2.burst_time;

        if(r1 != r2)
        {
            if(r1 < r2) return -1;
            else return 1;
        }
        if(p1.arrival_time < p2.arrival_time) return -1;
        else if(p1.arrival_time > p2.arrival_time) return 1;
        return 0;
    }

    constructor()
    {
        super();
        this.items = [];
    }

    push(process)
    {
        this.items.push(process);
        this.items.sort(this.is_less_than);
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


