var params = getParams();
var zfid = params.zfid;
var zfmxid = unescape(params.zfmxid);
var grid = params.grid;
var jsje = params.jsje;//金额
var mzwjsXqInfoStr = unescape(params.mzwjsXqInfo);
var  mzwjsXqInfo = JSON.parse(mzwjsXqInfoStr);
var openid = WEB_OPENID;//params.openid;
var zfddh = "";//  his系统的支付订单号
var ptddh = params.ptddh;//平台订单号  该系统生成的。   作为  商户订单号
var ywlx = "03";// 业务类型  门诊缴费
var zfje;//支付金额
$(function () {
    initWxPay();//先初始化
    // pushToHtml(JSON.parse(mzwjsXqInfo));
    $("#pay_jsje").text(jsje + '元');
    $("#kfysmc").text(mzwjsXqInfo.kfysmc);
    $("#kfksmc").text(mzwjsXqInfo.kfksmc);
    $("#xm").text(mzwjsXqInfo.xm);
    $("#kfrq").text(mzwjsXqInfo.kfrq);
    
    if($("#myDiv").val()=='true'){
    	$(".wxpay").attr('disabled',true);
    	$(".wxpay").css({'background-color':'#DADADA','border-color': '#DADADA'});
    }else{
    	$(".btn-group").on("click",mzWeixinPay);
    }
})

/**
 * 授权当前页面有支付权限  [该页面需要调用的微信的]
 */

function initWxPay() {
    ajaxPost('/wx/getConfig.action', {domainName: self.location.href}, function (config) {
        wx.config({
            debug: false, // 开启调试模式，true为开启，false不开启
            appId: config.appid, // 必填，公众号的唯一标识
            timestamp: config.timestamp, // 必填，生成签名的时间戳
            nonceStr: config.nonceStr, // 必填，生成签名的随机串
            signature: config.signature, // 必填，签名，用SHA1加密
            jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard']
        });
    }, function (err) {
        alert(err);
    });
}

/**
 * 进行微信支付
 */
var mzwjsZfssInfo ;
function mzWeixinPay() {
    //如果已经试算过  有了 zfddh，就重新生成一个ptddh
    if(zfddh != ""){
        ajaxSyncPost('/visMiddleOutpatient/getPtddh.action', {'grid':grid}, function (data) {
            ptddh = data;
        });
    }

    //试算
    ajaxSyncPost('/visMiddleOutpatient/payConfirmSs.action', {'zfid':zfid,'zfmxid':zfmxid,'grid':grid,'orgid':WEB_ORGID}, function (data) {
        console.log(data);
        //试算信息：his系统的  zfddid   zfdhh   zfje
        mzwjsZfssInfo = data;
        zfddh = mzwjsZfssInfo.zfddid;
        zfje = parseFloat(mzwjsZfssInfo.zfje);//传给微信的 支付金额（his系统试算回来的）
    })

    //js 调用微信支付
    ajaxPost('/wx/getWxPayConfig.action', {
        grid: grid,
        ptddh: ptddh,
        zfddh: zfddh,// 挂号zfddh,缴费结算zfddid,预缴金ptddh
        fy: parseInt(jsje*100),
        ywlx: ywlx,// 01门诊挂号,02 挂号支付, 03门诊缴费 04预缴金充值
        openid: openid

    }, function (config) {
        wx.chooseWXPay({
            timestamp: config.timestamp,// 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: config.noncestr,// 支付签名随机串，不长于 32 位
            package: config.prepayid,  // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: config.signtype,// 签名方式，默认为´SHA1´，使用新版支付需传入´MD5´
            paySign: config.paysign,//统一支付接口返回的paysign参数值 // 支付签名
            success: function (res) {
                payCallback(res);//支付成功后，调用后台 执行 系统支付
            },
            fail: function (res) {
                //接口调用失败时执行的回调函数。
            },
            cancel: function (res) {

                //用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
            },
            trigger: function (res) {

                //监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口。
            }
        });
    }, function (err) {
        alert(err);
    });
}

/**
 * 支付成功回调函数    调用his接口 结算his系统  之后跳到缴费成功页面
 */
function payCallback(e) {
    ajaxPost('/visMiddleOutpatient/queryAndHisPay.action', {
        "ptddh": ptddh,//本系统
        "kfysmc":mzwjsXqInfo.kfysmc,
        "kfksmc":mzwjsXqInfo.kfksmc
    } , function (config) {
        if (config != null && config != '') {
            // 如果支付失败！
            if (config.stat == "FAIL") {
            }
            //  如果支付成功！ 则跳转至支付成功页面!
            if (config.stat == "SUCCESS") {
                var param = {
                    "type":"confirm",//未结算 /  记录查询
                    "grid":grid,
                    "zfddid":config.zfddh
                };
                $("#myDiv").val("true");
                openUrlJson('/pages/diagnoseMiddle/payDetails.html',param);
            }
        }
    })
}
