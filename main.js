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
    },
    computed:{
    }
    ,
    methods:{
    }
});