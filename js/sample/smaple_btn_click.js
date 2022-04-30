let actived_sample_btn_id = "";
function sample_btn_active(id)
{
    if(actived_sample_btn_id != "") document.getElementById(actived_sample_btn_id).classList.remove("active");
    document.getElementById(id).classList.add("active");
    actived_sample_btn_id = id;
}