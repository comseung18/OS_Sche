function sample1()
{
    sample_btn_active("sample1");

    app.only_table_reset();
    // FCFS 
    app.process_add_by_param(0, 24, 0);
    app.process_add_by_param(1, 3, 0);
    app.process_add_by_param(2, 1, 0);
    app.process_add_by_param(3, 2, 0);
    
} 
