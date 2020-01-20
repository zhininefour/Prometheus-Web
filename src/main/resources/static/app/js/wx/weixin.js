'use strict';
$(function () {
    //初始化微信js授权
    initWxJsConfig();
});
//授权当前页面有js权限
function initWxJsConfig() {
    ajaxPost(ctx + "weChat/getConfig",{url: encodeURIComponent(window.location.href)},function(data) {
        wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appid, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名，见附录1
            // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard']
        });

        wx.error(function(res) {
            alert("调用微信jsapi返回的状态:" + res.errMsg);//这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
        });

        wx.ready(function() {
            wx.checkJsApi({
                jsApiList : ['scanQRCode'],
                success : function(res) {

                }
            });
        });
        //点击按钮扫描二维码
        $("#scanQRCode").click(function(){
            wx.scanQRCode({
                needResult : 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                desc: 'scanQRCode desc',
                // scanType : [ "qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success : function(res) {
                    //扫码后获取结果参数赋值给Input
                    debugger
                    let url = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    //商品条形码，取","后面的
                    if (url.indexOf(",") >= 0) {
                        let tempArray = url.split(',');
                        let barCode = tempArray[1];
                        selectByMeterNo(barCode);
                        // window.location.href = result;//因为我这边是扫描后有个链接，然后跳转到该页面
                        // $("#meterNo").val(barCode);
                        // window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${basePath}/wechat/toBookDetail?barCode=" + barCode + "&response_type=code&scope=snsapi_base&state=BINDFACE#wechat_redirect";
                    } else {
                        alert("请对准条形码扫码!");
                    }
                },
                error : function(){
                    console.log('扫描出错');
                }
            });
        });
    })
}


