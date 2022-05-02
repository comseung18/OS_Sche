class FcfsReadyQueue extends ReadyQueue
{
    constructor()
    {
        super();
        this.queue = []; // 추후에 원형큐 직접구현하여 바꿔야함
    }

    
    // 프로세스를 큐에 푸쉬
    push(process) 
    {
        this.queue.push(process);
    }

    // 가장 앞에 있는 프로세스를 뽑아서 반환
    pop()
    {
        let tmp = this.peek();
        this.queue.splice(0,1);
        return tmp;
    }

    // idx 위치에 있는 프로세스를 뽑아서 반환
    pop_idx(idx)
    {
        let tmp = this.queue[idx];
        this.queue.splice(idx, 1);
        return tmp;
    }

    // 가장 앞에 있는 프로세스를 보여줌.
    peek()
    {
        return this.queue[0];
    }

    empty()
    {
        return this.queue.length == 0;
    }

    list()
    {
        return this.queue;
    }
}