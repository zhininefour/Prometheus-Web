
var url = "../getwxconfig/?key=a0cbc5a7&callback=?";
// var data = { url: encodeURIComponent(window.location.href.split('#')[0])};
var data = { url: encodeURIComponent(window.location.href)};
$.getJSON(url, data, function (backdata){
    wx.config({
        debug: false,
        appId: backdata.appId,
        timestamp: backdata.timestamp,
        nonceStr: backdata.nonceStr,
        signature: backdata.signature,
        jsApiList: ['scanQRCode']
    });

    wx.ready(function () {
        wx.scanQRCode({
            needResult: 1,
            desc: 'scanQRCode desc',
            success: function (res) {
                $("div").fadeOut();
                if ("0"=="1"){
                    window.open(res.resultStr);
                } else if ("1"=="1"){
                    window.open("http://222.247.55.210:9088/Prometheus/app/device/water/add?qrresult=" + encodeURIComponent(res.resultStr));
                }
            },
            cancel:function(){
                $("div").fadeOut();
                if ("?"=="?"){
                    wx.closeWindow();
                }else{
                    //window.open("qrcancel=1");
                    history.back();
                }
            }
        });
    });

    wx.error(function (res) {
        alert(res.errMsg);
    });
});