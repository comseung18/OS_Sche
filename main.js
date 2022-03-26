function compare_process_arrival_time(p1, p2)
{
    x = Number(p1.arrival_time);
    y = Number(p2.arrival_time);
    if(x < y) return -1;
    else if(x==y) return 0;
    return 1;
}

var app = new Vue({
    el : "#app",
    data:{
        algorithm: 'FCFS',
        quantum_time: 0,
        arrival_time: 0,
        burst_time:0,
        process_list: []
    },
    computed:{
        sorted_process_list: function(){
            this.process_list.sort(compare_process_arrival_time);
            return this.process_list;
        }
    }
    ,
    methods:{
        process_add()
        {
            this.process_list.push({
                "arrival_time" : this.arrival_time,
                "burst_time": this.burst_time,
            });
        }
    }
});