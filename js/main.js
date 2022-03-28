function compare_process_arrival_time(p1, p2)
{
    x = Number(p1.arrival_time);
    y = Number(p2.arrival_time);
    if(x < y) return -1;
    else if(x==y) return 0;
    return 1;
}

function generate_random_color() {
    let color = "#";
    for (let i = 0; i < 3; i++)
      color += ("0" + Math.floor(((1 + Math.random()) * Math.pow(16, 2)) / 2).toString(16)).slice(-2);
    return color;
}

function cal_complement_color(color)
{
    let complement = 0xffffff ^ Number("0x" + color.substr(1));
    return "#" + complement.toString(16);
}

class Process
{
    constructor(arrival_time, burst_time)
    {
        this.arrival_time = arrival_time;
        this.burst_time = burst_time;
        this.turnaround_time = -1;
        this.power_consumption = 0;
        this.color = generate_random_color();
        this.complement_color = cal_complement_color(this.color);
    }
}

const app = new Vue({
    el : "#app",
    data:{
        max_time : 0,


        algorithm : 'FCFS',
        quantum_time : 1,
        total_cores : 1,
        p_cores : 1,


        processes : [],
        
        arrival_time: 0,
        burst_time: 1,

        time : 0,
        running: false,
        run_timer: null,

    },
    computed:{

    }
    ,
    methods:{
        start_btn_clicked()
        {
            if(!this.running)
            {
                this.running = true;
                this.start();
            }
            else
            {
                this.running = false;
                clearInterval(this.run_timer);
            }
        },

        start()
        {
            this.run_timer = setInterval(this.run, 1000);
        },

        run()
        {
            this.time = Number(this.time);
            if(this.time >= this.max_time)
            {
                this.running = false;
                clearInterval(this.run_timer);
                return;
            }

            
            this.time += 1;
            
        },

        reset()
        {
            this.algorithm = 'FCFS';
            this.quantum_time = 1;
            this.total_cores = 1;
            this.p_cores = 1;

            this.processes = [];

            this.arrival_time = 0;
            this.burst_time = 1;

            this.time = 0;
            this.running = false;
            if(this.run_timer) clearInterval(this.run_timer);

        },

        only_table_reset()
        {
            this.processes = [];
        },

        process_table_process_remove(index)
        {
            // console.log(index);
            this.processes.splice(index,1);
        },

        process_add()
        {
            if(this.running) return;

            this.processes.push(new Process(Number(this.arrival_time), Number(this.burst_time)));
            this.arrival_time = 0;
            this.burst_time = 1;
            this.processes.sort(compare_process_arrival_time);
        },
    }
});