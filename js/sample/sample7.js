function sample7()
{
    sample_btn_active("sample7");
    app.only_table_reset();
    var i;
    //at: 2씩 증가, bt : 16 고정
    for(i = 0 ; i<=16 ; i=i+2){
        app.process_add_by_param(i, 16);
    }
}

