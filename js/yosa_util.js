// day 일에 W 당 비용
function electricity_cost_per_w(day, k=1 , c=1)
{
    return day*day*day*k + c;
}

// day 일에 w Watt 를 썼을 때 내야하는 비용
function electricity_cost(day, w)
{
    return electricity_cost_per_w(day)*w;
}

// day1 일 부터 day2 일까지 매일 w 와트를 썼을 때 내야하는 비용
function electricity_cost_day1_day2(day1, day2, w)
{
    let ret = 0;
    for(let i=day1;i<=day2;++i)
        ret += electricity_cost(i, w);
    return ret;
} 

// day1 일 부터 n 일 동안 매일 W 와트를 썼을 때 내야하는 비용
function electricity_cost_day1_n(day1, n, w)
{
    if(n<=0) return 0;
    return electricity_cost_day1_day2(day1, day1+n-1, w);
}