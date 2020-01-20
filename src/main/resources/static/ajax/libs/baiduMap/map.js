"use strict";
// 百度地图API功能

// 初始化地图
function initMap() {
    var map = new BMap.Map("l-map");
    map.addControl(new BMap.NavigationControl());  //初始化地图控件
    map.addControl(new BMap.ScaleControl());
    map.addControl(new BMap.OverviewMapControl());
    map.enableScrollWheelZoom(true);//鼠标缩放
    map.panTo(point);

    let latitude = $("#latitude").val();
    let longitude = $("#longitude").val();
    if(latitude == undefined || latitude == "" || latitude == null){
        latitude = "28.247893";
    }

    if(longitude == undefined || longitude == "" || longitude == null){
        longitude = "112.933028";
    }

    var point=new BMap.Point(longitude,latitude);
    showLocationInfo(point);
    map.centerAndZoom(point, 18);//初始化地图中心点,设置城市和地图级别。
    var gc = new BMap.Geocoder();//地址解析类
    var marker = new BMap.Marker(point); //初始化地图标记
    marker.enableDragging(); //标记开启拖拽
    setMarker(marker);

    map.centerAndZoom(point, 18);//设置中心点坐标和地图级别
    map.addOverlay(marker); //将标记添加到地图中


    var ac = new BMap.Autocomplete({"input": "suggestId", "location": map});//建立一个自动完成的对象
    ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        let str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        G("searchResultPanel").innerHTML = str;
    });

    var myValue;
    ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
        setPlace();
    });



//获取元素
function G(id) {
    return document.getElementById(id);
}

//搜索定位
function setPlace() {
    map.clearOverlays();    //清除地图上所有覆盖物
    function myFun() {
        var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
        var marker = new BMap.Marker(pp)
        marker.enableDragging(); //标记开启拖拽
        setMarker(marker);
        map.centerAndZoom(pp, 18);//设置中心点坐标和地图级别
        map.addOverlay(marker); //将标记添加到地图中

        //获取地址信息
        gc.getLocation(pp, function(rs){
            showLocationInfo(pp, rs);
        });
    }
    var local = new BMap.LocalSearch(map, { //智能搜索
        onSearchComplete: myFun
    });
    local.search(myValue);
}

//显示地址经纬度信息
function showLocationInfo(pt, rs){
    $("#latitude").val(pt.lat);
    $("#longitude").val(pt.lng);
}

//定位标记
function setMarker(marker){
    //添加标记拖拽监听
    marker.addEventListener("dragend", function(e){
        //获取地址信息
        gc.getLocation(e.point, function(rs){
            showLocationInfo(e.point, rs);
        });
    });

    //添加标记点击监听
    marker.addEventListener("click", function(e){
        gc.getLocation(e.point, function(rs){
            showLocationInfo(e.point, rs);
        });
    });
    //跳动的动画
    // marker.setAnimation(BMAP_ANIMATION_BOUNCE);
}
}
/*

//弹出Map地图当前Chy的最外层DIVid,供选择后赋值
var OpenMap_DivId = "";
var Map_Div_id = "";
//弹出地图选择线路
var ac = null;
var myValue;
var map = null; //地图
var marker = null; //标记物
var myIcon = null; //图标
var MouseAxes = {
    lng: null,
    lat: null,
    ID: "",
    Title: ""
};
var g_Longitude = "";
var g_Latitude = "";
var LineChkPointList = null;
var LineTermList = null;


function MapPosition(msg_Box_Parent, ActionType) {

    var Longitude = "";
    var Latitude = "";

    var MapViewLevel = 17;
    var LineID = $("#" + msg_Box_Parent).find("#txt_aoeLineID").val();
    var ChkPointID = ""; // $("#" + msg_Box_Parent).find("#aoeHidChkPointID").val();
    var LineList = null;
    //确定地图中心的经纬度
    if (ajaxProPage == LampSys.Report.ChkPointFile) {
        MapViewLevel = 20;
        if (LineID != "" && LineID != null) {
            dataList = ajaxProPage.GetChkPointByLineID(LineID).value;
            LineChkPointList = dataList[0];
            LineList = dataList[1];
            LineTermList = dataList[2];
            if (LineChkPointList != null && LineChkPointList.Rows.length > 0 && aoeLinePosition == "") {
                Latitude = LineChkPointList.Rows[0]["LineLatitude"].toString();
                Longitude = LineChkPointList.Rows[0]["LineLongitude"].toString();
            }
            else {
                Latitude = LineList.Rows[0]["LineLatitude"].toString();
                Longitude = LineList.Rows[0]["LineLongitude"].toString();
            }
        }
    }
    if (ajaxProPage == LampSys.Report.TermFile) {
        MapViewLevel = 20;
        if (LineID != "" && LineID != null) {
            dataList = ajaxProPage.GetTermByLineID(LineID).value;
            LineChkPointList = dataList[0];
            LineList = dataList[1];
            if (LineChkPointList != null && LineChkPointList.Rows.length > 0 && aoeLinePosition == "") {
                Latitude = LineChkPointList.Rows[0]["LineLatitude"].toString();
                Longitude = LineChkPointList.Rows[0]["LineLongitude"].toString();
            }
            else {
                Latitude = LineList.Rows[0]["LineLatitude"].toString();
                Longitude = LineList.Rows[0]["LineLongitude"].toString();
            }
        }
    }
    var aoeLinePosition = $("#" + msg_Box_Parent).find("#aoeLinePosition").val().split(',');
    if (aoeLinePosition.length == 2) {
        Latitude = aoeLinePosition[0];
        Longitude = aoeLinePosition[1];
    }
    g_Latitude = Latitude;
    g_Longitude = Longitude;
    Map_Div_id = "msg_Box_MapPosition";
    var msg_Title = "选择经纬度";
    var conTentTable = "";
    conTentTable += "<table  cellspacing='0' cellpadding='0' border='0' style='width:100%;'>";
    conTentTable += "<tr>";
    conTentTable += "<td class='spanTd' style='padding-top: 0px;width: 80px;'><span style='margin: 0px 4px 3px;'>搜索地址:</span></td>";
    conTentTable += "<td><div id='r-result'><input class='form-control' placeholder='请输入查询的地址' required='required' id='aoeAddrSearch'/></div><div id='searchResultPanel' style='border: 1px solid #C0C0C0; width: 150px; height: auto;display: none;'></div></td>";
    conTentTable += "</tr>";
    conTentTable += "<tr  style='height: 260px;'>";
    conTentTable += "<td colspan='7' style='padding-top:10px;'><div id='eMap' style='width:100%;height:250px;'></div></td>";
    conTentTable += "</tr>";
    conTentTable += "<tr  style='height: 25px;'>";
    conTentTable += "<td colspan='7' style='padding-top:5px;'><p style='display: inline;color: #7D7979;'>注：1、可拖拽图标以标记地图位置；2、右键点击\"将图标移到此处\"即可快速移动图标。</p></td>";
    conTentTable += "</tr>";
    conTentTable += "</table>";

    var btnHtml = "";
    if (ajaxProPage == LampSys.Report.ChkPointFile) {
        btnHtml += "<input type='button' class='btn btn-success' id='btn_fullScreen' value='全屏显示' onclick=\"MapFun();\">";
    }
    btnHtml += "<button id='btn_Sava' type='button' class='btn btn-primary' onclick=\"ChooseMapPosition();\">确定位置</button>"
    btnHtml += "<button type='button' class='btn btn-default' data-dismiss='modal' onclick=\"CloseChy('" + Map_Div_id + "')\">关闭</button>";
    showChy(Map_Div_id, msg_Title, "800px", conTentTable, btnHtml);



    setTimeout(function () {
        // 百度地图API功能
        map = new BMap.Map("eMap"); //创建地图
        if (ajaxProPage == LampSys.Report.LineFile) {
            myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
                offset: new BMap.Size(11, 25), // 指定定位位置
                imageOffset: new BMap.Size(0, 0 - 11 * 25) // 设置图片偏移
            });
        }
        else if (ajaxProPage == LampSys.Report.ChkPointFile) {
            myIcon = new BMap.Icon("../Images/LampAdd.png?vs=1", new BMap.Size(32, 32));
        }
        else if (ajaxProPage == LampSys.Report.TermFile) {
            myIcon = new BMap.Icon("../Images/GreenConStatus.png?vs=1", new BMap.Size(32, 32));
        }
        if (Longitude == "" || Latitude == "") {
            var myCity = new BMap.LocalCity(); //默认获取IP所在城市
            myCity.get(myFun);
            function myFun(result) {
                var cityName = result.name;
                map.centerAndZoom(cityName, MapViewLevel); //初始化地图
            }
        }
        else {
            var point = new BMap.Point(parseFloat(Longitude), parseFloat(Latitude));
            map.centerAndZoom(point, MapViewLevel); //初始化地图
        }
        // 添加带有定位的导航控件
        var navigationControl = new BMap.NavigationControl({
            // 靠左上角位置
            anchor: BMAP_ANCHOR_BOTTOM_LEFT,
            // LARGE类型
            type: BMAP_NAVIGATION_CONTROL_LARGE,
            // 启用显示定位
            enableGeolocation: true
        });
        map.addControl(navigationControl);
        map.enableScrollWheelZoom(true); //滚动滑轮缩放地图

        //监听鼠标事件，获取鼠标所在经纬度
        map.addEventListener("mousedown", function (e) {
            MouseAxes.lng = e.point.lng;
            MouseAxes.lat = e.point.lat;
        });

        //右键移动图标到鼠标处
        var menu = new BMap.ContextMenu();
        var txtMenuItem = [{
            text: '将图标移到此处',
            callback: function () {
                map.removeOverlay(marker);
                var point = new BMap.Point(MouseAxes.lng, MouseAxes.lat);
                marker = new BMap.Marker(point, { icon: myIcon }); // 创建标注
                marker._config.title = MouseAxes.Title;
                marker._config.Id = MouseAxes.ID;
                marker._config.DevType = "0";
                marker.enableDragging();
                map.addOverlay(marker);
            }
        }];
        for (var i = 0; i < txtMenuItem.length; i++) {
            menu.addItem(new BMap.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, 100));
        }
        map.addContextMenu(menu);
    }, 300);

    setTimeout(function () {
        MapAddrAutocomplate();
        //创建标记
        var hasCurrentIcon = false;
        if (LineChkPointList != null && LineChkPointList.Rows.length > 0) {

            for (var i = 0; i < LineChkPointList.Rows.length; i++) {
                if (LineChkPointList.Rows[i]["Latitude"] != null) {
                    var chkName = "";
                    var chkID = "";
                    var ChkPointID = "";
                    if (ajaxProPage == LampSys.Report.ChkPointFile) {
                        chkName = LineChkPointList.Rows[i]["Name"].toString();
                        chkID = LineChkPointList.Rows[i]["ChkPointID"].toString();
                        ChkPointID = $("#" + msg_Box_Parent).find("#aoeHidChkPointID").val();
                    }
                    else if (ajaxProPage == LampSys.Report.TermFile) {
                        chkName = LineChkPointList.Rows[i]["TermName"].toString();
                        chkID = LineChkPointList.Rows[i]["TermID"].toString();
                        ChkPointID = $("#" + msg_Box_Parent).find("#aoeHidTermID").val();
                    }


                    var chkLatitude = LineChkPointList.Rows[i]["Latitude"].toString();
                    var chkLongitude = LineChkPointList.Rows[i]["Longitude"].toString();


                    if (ChkPointID == chkID) {
                        if (Longitude == "" || Latitude == "") {
                            marker = new BMap.Marker(map.getCenter(), { icon: myIcon }); // 创建标注
                        }
                        else {
                            var point = new BMap.Point(parseFloat(chkLongitude), parseFloat(chkLatitude));
                            marker = new BMap.Marker(point, { icon: myIcon }); // 创建标注
                        }
                        marker._config.title = chkName;
                        marker._config.Id = chkID;
                        marker._config.DevType = "0";
                        marker.enableDragging();
                        map.addOverlay(marker);             // 将标注添加到地图中
                        // 可拖拽
                        hasCurrentIcon = true;
                        MouseAxes.ID = chkID;
                        MouseAxes.Title = chkName;
                    }
                    else {
                        var IconImage = "";
                        if (ajaxProPage == LampSys.Report.ChkPointFile) {
                            IconImage = "../Images/LampOff.png?vs=1";
                        }
                        else if (ajaxProPage == LampSys.Report.TermFile) {
                            IconImage = "../Images/GreyConStatus.png?vs=1";
                        }
                        var point = new BMap.Point(parseFloat(chkLongitude), parseFloat(chkLatitude));
                        var myIcon1 = new BMap.Icon(IconImage, new BMap.Size(32, 32));
                        var marker1 = new BMap.Marker(point, { icon: myIcon1 }); // 创建标注
                        marker1._config.title = chkName;
                        marker1._config.Id = chkID;
                        marker1._config.DevType = "0";
                        marker1.enableDragging();
                        map.addOverlay(marker1);             // 将标注添加到地图中
                        // 可拖拽
                    }
                }
            }
        }
        if (!hasCurrentIcon) {
            if (Longitude == "" || Latitude == "") {
                marker = new BMap.Marker(map.getCenter(), { icon: myIcon }); // 创建标注
            }
            else {
                var point = new BMap.Point(parseFloat(Longitude), parseFloat(Latitude));
                marker = new BMap.Marker(point, { icon: myIcon }); // 创建标注
            }
            marker._config.title = "";
            marker._config.Id = "0";
            marker._config.DevType = "0";
            marker.enableDragging();                 // 可拖拽
            map.addOverlay(marker);             // 将标注添加到地图中
        }
        if (ajaxProPage == LampSys.Report.ChkPointFile && LineTermList != null && LineTermList.Rows.length > 0) {

            for (var i = 0; i < LineTermList.Rows.length; i++) {
                if (LineTermList.Rows[i]["Latitude"] != null) {

                    var chkName = LineTermList.Rows[i]["TermName"].toString();
                    var chkID = LineTermList.Rows[i]["TermID"].toString();


                    var chkLatitude = LineTermList.Rows[i]["Latitude"].toString();
                    var chkLongitude = LineTermList.Rows[i]["Longitude"].toString();

                    var IconImage = "../Images/GreyConStatus.png?vs=1";

                    var point = new BMap.Point(parseFloat(chkLongitude), parseFloat(chkLatitude));
                    var myIcon1 = new BMap.Icon(IconImage, new BMap.Size(32, 32));
                    var marker1 = new BMap.Marker(point, { icon: myIcon1 }); // 创建标注
                    marker1._config.title = chkName;
                    marker1._config.Id = chkID;
                    marker1._config.DevType = "1";
                    marker1.enableDragging();
                    map.addOverlay(marker1);             // 将标注添加到地图中
                }
            }
        }

    }, 500);


    MapFun = function () {
        //var iframeNumber = parent.outId.substring(1, parent.outId.length);
        //parent.parent.parent.IframeNumberMap = iframeNumber;
        //  parent.parent.parent.document.getElementById('fullScreen_divMap').innerHTML = $("#div_bodyDevMap").html();
        //  parent.parent.parent._ajaxProPage = "LampSys.ChkPointFile";

        //parent.parent.parent._RouteParamConditionValue = TermID + "," + RouteReadingTime;

        parent.parent.parent._AllOverlay = map.getOverlays();
        parent.parent.parent._Longitude = g_Longitude;
        parent.parent.parent._Latitude = g_Latitude;
        parent.parent.parent._CurChkPointID = $("#Edit_ChkPoint_Chy").find("#aoeHidChkPointID").val();
        parent.parent.parent.document.getElementById("btn_fullMap").click();
    }
}

function RefreshMap() {
    map.clearOverlays();
    var _AllOverlay = parent.parent.parent._RtnAllOverlay;
    var ChkPointID = $("#Edit_ChkPoint_Chy").find("#aoeHidChkPointID").val();
    //创建标记
    var hasCurrentIcon = false;
    if (_AllOverlay != null && _AllOverlay.length > 0) {

        for (var i = 0; i < _AllOverlay.length; i++) {
            if (_AllOverlay[i]._config.Id != null) {
                var chkName = _AllOverlay[i]._config.title;
                var chkID = _AllOverlay[i]._config.Id;
                var DevType = _AllOverlay[i]._config.DevType;
                var chkLatitude = _AllOverlay[i].point.lat.toString();
                var chkLongitude = _AllOverlay[i].point.lng.toString();
                if ((ChkPointID == chkID || chkID == "0") && DevType == "0") {
                    var point = new BMap.Point(parseFloat(chkLongitude), parseFloat(chkLatitude));
                    marker = new BMap.Marker(point, { icon: myIcon }); // 创建标注
                    marker._config.title = chkName;
                    marker._config.Id = chkID;
                    marker._config.DevType = DevType;
                    marker.enableDragging();                 // 可拖拽
                    map.addOverlay(marker);             // 将标注添加到地图中
                    hasCurrentIcon = true;
                }
                else {

                    if (DevType == "0") {
                        IconImage = "../Images/LampOff.png?vs=1";
                    }
                    else if (DevType == "1") {
                        IconImage = "../Images/GreyConStatus.png?vs=1";
                    }
                    var point = new BMap.Point(parseFloat(chkLongitude), parseFloat(chkLatitude));
                    var myIcon1 = new BMap.Icon(IconImage, new BMap.Size(32, 32));
                    var marker1 = new BMap.Marker(point, { icon: myIcon1 }); // 创建标注
                    marker1._config.title = chkName;
                    marker1._config.Id = chkID;
                    marker1._config.DevType = DevType;
                    marker1.enableDragging();                 // 可拖拽
                    map.addOverlay(marker1);             // 将标注添加到地图中
                }
            }
        }
    }
}



//地图搜索自动补全功能
function G(id) {
    return document.getElementById(id);
}

function MapAddrAutocomplate() {
    //建立一个自动完成的对象
    ac = new BMap.Autocomplete({
        "input": "aoeAddrSearch",
        "location": map
    });
    ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        G("searchResultPanel").innerHTML = str;
    });


    ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

        setPlace();
    });

}
function setPlace() {
    map.clearOverlays();    //清除地图上所有覆盖物
    function myFun() {
        var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
        map.centerAndZoom(pp, 17);
        marker = new BMap.Marker(pp, { icon: myIcon }); // 创建标注
        map.addOverlay(marker);    //添加标注
        marker.enableDragging();
    }
    var local = new BMap.LocalSearch(map, { //智能搜索
        onSearchComplete: myFun
    });
    local.search(myValue);
}



//确定
function ChooseMapPosition() {
    var pos = marker.getPosition(); //获取marker的位置
    var strPosition = pos.lat.toString() + "," + pos.lng.toString();
    $("#" + OpenMap_DivId).find("#aoeLinePosition").val(strPosition);
    //Report

    //    if (AddOrEdit == "1")//修改
    //    {
    var allOverlay = map.getOverlays();
    var dataRef = [];
    var dataRef1 = [];
    var row = 0;
    var row1 = 0;
    var row2 = 0;
    if (ajaxProPage == LampSys.Report.ChkPointFile) {

        for (var i = 0; i < allOverlay.length; i++) {
            if (allOverlay[i]._config.Id != null && allOverlay[i]._config.Id != "" && allOverlay[i]._config.Id != "0") {


                if (allOverlay[i]._config.DevType == "0") {
                    dataRef[row1] = {
                        "ChkPointID": allOverlay[i]._config.Id,
                        "Longitude": allOverlay[i].point.lng.toString(),
                        "Latitude": allOverlay[i].point.lat.toString()
                    }
                    row1++;
                }
                else if (allOverlay[i]._config.DevType == "1") {
                    dataRef1[row2] = {
                        "TermID": allOverlay[i]._config.Id,
                        "Longitude": allOverlay[i].point.lng.toString(),
                        "Latitude": allOverlay[i].point.lat.toString()
                    }
                    row2++;
                }
                // row++;
            }
        }

        if (dataRef.length > 0) {
            LampSys.Report.ChkPointFile.SaveLngAndLat(dataRef, dataRef1);

        }
    }
    else if (ajaxProPage == LampSys.Report.TermFile) {
        for (var i = 0; i < allOverlay.length; i++) {
            if (allOverlay[i]._config.Id != null && allOverlay[i]._config.Id != "" && allOverlay[i]._config.Id != "0") {
                dataRef[row] = {
                    "TermID": allOverlay[i]._config.Id,
                    "Longitude": allOverlay[i].point.lng.toString(),
                    "Latitude": allOverlay[i].point.lat.toString()
                }
                row++;
            }
        }

        if (dataRef.length > 0) {
            LampSys.Report.TermFile.SaveLngAndLat(dataRef);

        }
    }

    //  }
    //  DeleteDialogBox(msg_Box);
    CloseChy(Map_Div_id);
}*/
