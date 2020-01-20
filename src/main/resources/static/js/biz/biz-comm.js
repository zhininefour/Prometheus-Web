//点击按钮，设置日期时间区间在输入框
function getStartEndTime(val) {
    var returnParam = [];
    var start = '';
    var curDate = new Date();//获取系统当前时间
    var end = curDate.Format("yyyy-MM-dd HH:mm:ss");
    if (val == '1'){
        //24小时
        var preDate = new Date(curDate.getTime() - 24*60*60*1000); //前一天
        start = preDate.Format("yyyy-MM-dd HH:mm:ss");
    }else if (val == '2'){
        //最近1周
        var preDate = new Date(curDate.getTime() - 7*24*60*60*1000); //前一周
        start = preDate.Format("yyyy-MM-dd HH:mm:ss");
    }else if (val == '3'){
        //最近2周
        var preDate = new Date(curDate.getTime() - 14*24*60*60*1000); //前两周
        start = preDate.Format("yyyy-MM-dd HH:mm:ss");
    }
    returnParam.push(start);
    returnParam.push(end);
    return returnParam
}

//弹出选则测量点页面
function openGetChkPointPage() {
    var url = ctx + "basefile/chkpointfile/getChkPoint";
    var options = {
        title: '选择测量点',
        url: url,
        callBack: setChkPoint
    };
    $.modal.openOptions(options);
}

//回调函数
function setChkPoint(index, layero) {
    var body = layer.getChildFrame('body', index);
    $("#chkPointID").val(body.find('#chkPointID').val());
    $("#chkPointName").val(body.find('#chkPointName').val());
    $("#chkPointType").val(body.find('#chkPointType').val());
    layer.close(index);
}


//根据机构id ajax后台获取 角色
function selectRoleList(val) {
    if (val != '' && val != undefined) {
        //清空
        var html = $("#role");
        var config = {
            url: prefix + '/getRoleList/' + val,
            type: "get",
            beforeSend: function () {
                html.html('');
                $.modal.loading("正在查询中，请稍后...");
                $.modal.disable();
                // $.modal.loading("正在处理中，请稍后...");
            },
            success: function (result) {
                if (result.code == web_status.SUCCESS) {
                } else if (result.code == web_status.WARNING) {
                    $.modal.alertWarning(result.msg)
                } else {
                    $.modal.alertError(result.msg);
                }
                var data = result.roleList;
                if(data.length > 0){
                    for (var i = 0; i < data.length; i++) {
                        var role = data[i];
                        if (true === role.flag) {
                            html.append("<option value=" + role.roleId + " selected=\"true\">" + role.roleName + "</option>");
                        } else {
                            html.append("<option value=" + role.roleId + ">" + role.roleName + "</option>");
                        }
                    }
                }
                $.modal.closeLoading();
                $.modal.enable();
            }
        };
        $.ajax(config);
    }
}

//ajax后台获取数据，然后拼接html
//ajax后台获取数据，然后拼接html
function selectBuildList(val, param) {
    if (val != '' && val != undefined) {
        //清空
        var html = $("#buildId");
        html.html('<option value="">请选择</option>');
        // 提交数据
        var config = {
            url: ctx + "basefile/build/list",
            data: {"districtId" : val},
            type: "post",
            async: true,
            dataType: "json",
            // processData: false,
            // contentType: false,
            beforeSend: function () {
                $.modal.loading("正在查询中，请稍后...");
                $.modal.disable();
            },
            success: function (result) {
                if (result.code == web_status.SUCCESS) {
                } else if (result.code == web_status.WARNING) {
                    $.modal.alertWarning(result.msg)
                } else {
                    $.modal.alertError(result.msg);
                }
                var data = result.rows;
                for ( var i = 0; i < data.length; i++) {
                    var build = data[i];
                    if($("#oldBuildId").val() != undefined && $("#oldBuildId").val() == build.buildId) {
                        html.append("<option value=" + build.buildId + " selected=\"true\">" + build.buildName + "</option>");
                    }else {
                        html.append("<option value=" + build.buildId + ">" + build.buildName + "</option>");
                    }
                }
                $.modal.closeLoading();
                $.modal.enable();
            }
        };
        $.ajax(config);
    }
    // 如果有param参数，就调用table的 查询方法
    if (param != '' && param != null && param != undefined) {
        if (param == 'search') {
            $("#districtId").val('');
            if (val != '' && val != undefined) {
                var districtId = val.split(",")[0];
                $("#districtId").val(districtId);
            }
            $.table.search();
        }
    }
}

//根据选择的线路 得到线路id赋值 给定位用
function setLineLocationID(val) {
    var lineLocationID = val.split(",")[0];
    $("#lineLocationID").val(lineLocationID);
}