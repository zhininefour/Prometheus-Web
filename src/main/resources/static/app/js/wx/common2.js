


// 初始化码表 及  设置选择的值
function initCodeType(codeType,id,title,input) {
    var inputValue;
    var prefix = ctx + "app/device/water";
    // var prefix = ctx + "app/bindling-water";
    ajaxPost("xcx/CommAction!getCodeDetail.action", {'codeType': codeType}, function (data) {
        var datalist = [];
        for (var i = 0; i < data.length; i++) {
            var info = {
                "title": data[i].display_value,
                "value": data[i].data_value,
                "data-values": data[i].data_value
            };
            if(input != undefined && input == data[i].data_value){
                $('#' + id).attr('data-values', data[i].data_value);//设置 value值。PS：attr(属性，值)
                inputValue =  data[i].display_value;
            }
            datalist.push(info);
        }
        var selectConfig = {
            title: title,
            items: datalist,
            multi: false
        };
        selectConfig.input = inputValue;//设置初始值
        $('#'+ id +'').select(selectConfig);
    });
}