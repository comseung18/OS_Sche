class YosaBfScheduler extends Scheduler
{
    constructor(cores, processes)
    {
        super(cores, processes, new FcfsReadyQueue());
    }
}