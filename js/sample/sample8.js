
function sample8()
{
    sample_btn_active("sample8");
    app.only_table_reset();
    var i = Math.round((Math.random()*(15-3))+3);
    for(let m = 0 ; m<=i ; m=m+1){
        
        var j = Math.round(Math.random()*30);
        var k = Math.round(Math.random()*(30-1)+1);
        app.process_add_by_param(j,k);
    }
}