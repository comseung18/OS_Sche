
function sample8()
{
    sample_btn_active("sample8");
    app.only_table_reset();
    var i = Math.round((Math.random()*(15-3))+3);
    for(let m = 0 ; m<i ; ++m){
        
        var at = Math.round(Math.random()*30);
        var bt = Math.round(Math.random()*(30-1)+1);
        var dead = at + Math.ceil(bt*(Math.random()*1.5 + 0.8));
        app.process_add_by_param(at,bt, dead);
    }
}