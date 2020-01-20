"use strict";
function getLocation() {
    let latitude = "28.247893", longitude = "112.93302", parentId = "undefined";
    let getLocationType = $("#getLocationType").val();
    if (getLocationType === 'lineAdd') {

    } else if (getLocationType === 'lineEdit') {
        latitude = $("#latitude").val();
        longitude = $("#longitude").val();
    } else if (getLocationType === 'termAdd') {
        let lineAreaID = $("#lineAreaID").val();
        if(lineAreaID === null || lineAreaID === undefined){
            $.modal.alertWarning("请选择线路");
            return;
        }else{
            parentId = lineAreaID.split(",")[0];
        }
    } else if (getLocationType === 'termEdit') {
        let oldLineId = $("#lineID").val();// 原线路id
        let lineAreaId = $("#lineAreaID").val();
        if(lineAreaId !== undefined ){
           let newLineId = lineAreaId.split(",")[0];
           if(newLineId !== oldLineId){
               parentId = newLineId; //选择了新线路，则根据这个新的去获取经纬度
           }
        }
        latitude = $("#latitude").val();
        longitude = $("#longitude").val();
    } else if (getLocationType === 'pointAdd') {
        let termId = $("#termID").val();
        if(termId === "" || termId === null || termId === undefined){
            $.modal.alertWarning("请选择终端");
            return;
        }
        parentId = termId;
    } else if (getLocationType === 'pointEdit') {
        let oldTermId = $("#oldTermId").val();// 原终端id
        let newTermID = $("#termID").val();//选择的终端id
        if(oldTermId !== newTermID){
            parentId = newTermID; //选择了新终端，则根据这个新的去获取经纬度
        }
        latitude = $("#latitude").val();
        longitude = $("#longitude").val();
    }

    let url = ctx + "common/getLocation/" + getLocationType + "/" + parentId + "/" + latitude + "/" + longitude;
    // let options = {
    //     title: '经纬度选择',
    //     width: "800",
    //     url: url,
    //     callBack: setLocation
    // };
    // $.modal.openOptions(options);
    $.modal.openFull('经纬度选择', url);

// $.ajax({
    //     type: "post",
    //     url: ctx + "common/getLocation",
    //     data: {
    //         "getLocationType": getLocationType,
    //         "parentId": parentId,
    //         "latitude": latitude,
    //         "longitude": longitude
    //     },
    //     dataType: 'html', // html or text 都可以
    //     success: function (result) {
    //         layer.open({
    //             type: 2,
    //             fix: false,
    //             maxmin: true,
    //             shade: 0.3,
    //             title: '经纬度选择',
    //             area: ['800px', $(window).height() - 50 + 'px'],
    //             content: result, // 将返回值(页面路径)存入此
    //             shadeClose: true,
    //             skin: 'layui-layer-gray',
    //             btn: ['<i class="fa fa-check"></i> 确认', '<i class="fa fa-close"></i> 关闭'],
    //             yes: setLocation,
    //             cancel: function () {
    //                 return true;
    //             }
    //         });
    //     }
    // });
}

// function setLocation(index) {
//     var body = layer.getChildFrame('body', index);
//     $("#latitude").val(body.find('#latitude').val());
//     $("#longitude").val(body.find('#longitude').val());
//     layer.close(index);
// }
function setLocation(latitude,longitude) {
    $("#latitude").val(latitude);
    $("#longitude").val(longitude);
}