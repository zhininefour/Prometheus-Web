'use strict';
// 当前服务地址
// var SERVER_BAS_URL = "http://127.0.0.1:8080/mbe-app";
// var HTML_BAS_URL = "http://127.0.0.1:8080/mbe-app/mobilehtml/html";
// var SERVER_BAS_URL = "http://www.kang361.cn/mbe-app";
// var HTML_BAS_URL = "http://www.kang361.cn/mbe-app/mobilehtml/html";

// 机构编码
// var WEB_ORGID = request("orgid");
// var WEB_OPENID = request("openid");







function pushToHtml(data) {
    var obj = null;
    for (var key in data) {
        obj = $('#' + key);
        if (obj.length > 0) {
            pushToIdHtml(obj, data[key]);
        }

        obj = $('[name=' + key + ']');
        if (obj.length > 0) {
            pushToNameHtml(obj, data[key]);
        }
    }
}

function pushToIdHtml(obj, value) {
    var tagName = obj[0].tagName.toLowerCase();
    if ('div' == tagName || 'li' == tagName || "i" == tagName || "p" == tagName || 'span' == tagName) {
        obj.html(value);
    } else if ('input' == tagName) {
        var type = obj.attr("type").toLowerCase();
        if ('text' == type) {
            obj.val(value);
        }
    } else if ('img' == tagName) {
        obj.attr('src', value || obj.attr('src'));
    } else if ('select' == tagName) {
        obj.val(value).trigger("change");
    } else if ("textarea" == tagName) {
        obj.val(value);
    } else if ('a' == tagName) {
        obj.html(value);
        obj.attr('href', value + "?" + RndNum(10));
    }
}

function pushToNameHtml(obj, value) {
    var tagName = obj[0].tagName.toLowerCase();
    if ('div' == tagName || 'li' == tagName || "i" == tagName || "p" == tagName || 'span' == tagName) {
        obj.html(value);
    } else if ('input' == tagName) {
        var type = obj.attr("type").toLowerCase();
        if ('text' == type || 'hidden' == type) {
            obj.val(value);
        }
    } else if ('img' == tagName) {
        obj.attr('src', value);
    } else if ('select' == tagName) {
        obj.val(value).trigger("change");
    } else if ("textarea" == tagName) {
        obj.val(value);
    } else if ('a' == tagName) {
        obj.html(value);
        obj.attr('href', value);
        obj.attr('title', value);
    }
}

/**
 * 上传图片
 * @param {Object} formId
 * @param {Object} callBack
 */
function ajaxUplodImg(formId, callBack) {
    var formData = new FormData($("#" + formId)[0]);
    //$('#uploadPic').serialize() 无法序列化二进制文件，这里采用formData上传
    //需要浏览器支持：Chrome 7+、Firefox 4+、IE 10+、Opera 12+、Safari 5+。
    $.ajax({
        type: "POST",
        url: "/comm/fileUpload/upload.action?id=fileHandleService_image",
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.errCode == '0') {
                $.each(eval('(' + data.map + ')'), function (index, text) {
                    callBack(text);
                });
            } else {
                alert('上传图片失败');
            }
        }
    });
}

/**
 * 获取form表单name数据
 * 格式:
 * {
 * 		key:value, 
 * 		key1:value1
 * }
 * @param {Object} 表单id
 */
function paramForm(formId) {
    var params = {};
    var arr = $('#' + formId).serializeArray();
    for (i in arr) {
        params[arr[i].name] = arr[i].value;
    }
    return params;
}

/**
 * 公用下载方法
 * @param url
 * @param urlParams
 */
function download(url, formId) {
    var paramsUrl = $('#' + formId).serialize();
    if (paramsUrl) {
        paramsUrl = '&' + paramsUrl;
    }
    window.location.href = SERVER_BAS_URL + url + "?orgid=" + WEB_ORGID + paramsUrl;
}


//产生随机数函数
function RndNum(n) {
    var rnd = "";
    for (var i = 0; i < n; i++)
        rnd += Math.floor(Math.random() * 10);
    return rnd;
}

// 获取当前时间毫秒数
function getTimeMs() {
    return new Date().getTime();
}

/**
 * 校验回调函数
 * @param btnId        点击校验按钮id
 * @param formId    需要校验的form表单id
 * @param rules        校验规则
 * @param callback    校验成功回调函数
 */
function initValidate(btnId, formId, rules, callback) {
    $('#' + btnId).click(function () {
        $("#" + formId).submit();
    });

    $("#" + formId).ApusValidate({
        rules: rules, submitHandler: function () {
            callback();
        }
    });
}

/**
 * 公用跳转界面方法
 * @param url        需要跳转url
 * @param paramsUrl    需要跳转url所带的参数：name=abc&sex=男
 */
function openUrl(url, paramsUrl) {
    var finalUrl = HTML_BAS_URL + url;
    if (url.indexOf('?') == -1) {
        finalUrl += "?";
    } else {
        finalUrl += "&";
    }
    finalUrl += paramsUrl + "&version=" + getTimeMs();
    // finalUrl += "orgid=" + WEB_ORGID + "&openid=" + WEB_OPENID + "&" + paramsUrl + "&version=" + getTimeMs();
    window.location.href = finalUrl;
}

/**
 * 公用跳转界面方法
 * @param url        需要跳转url
 * @param paramsObj    需要跳转url所带的对象参数：{}
 */
function openUrlJson(url, paramsObj) {
    var finalUrl = HTML_BAS_URL + url;
    if (typeof paramsObj != 'object') {
        alert("参数必须为object对象");
        return;
    }
    paramsObj.orgid = WEB_ORGID;
    paramsObj.openid = WEB_OPENID;
    if (!$.isEmptyObject(paramsObj)) {
        finalUrl += "?" + $.param(paramsObj);
    }
    window.location.href = finalUrl + "&version=" + getTimeMs();
}
/**
 * 清空指定formid中表单数据
 * @param formid    formid
 */
function clearForm(formid) {
    $('#' + formid)[0].reset();
}
//选项卡
function tab() {
    var tabItem = $(".tab span");
    tabItem.on("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
        var index = tabItem.index(this);
        $(".tabs > div").eq(index).show().siblings().hide();
    });
};
//
//折叠
function accordion() {
    $(".accordion-title").toggleClass("active").siblings().removeClass("active");
    $(".accordion-title").next(".accordion-body").slideToggle(200).siblings(".accordion-body").slideUp(200);
};

/**
 * 获取当前时间 年月日 时分秒
 * @param formt  yyyy-mm-dd 年月日  不传为 年月日时分秒
 * @returns {*}
 */
function getDate(formt) {
    var myDate = new Date();
    myDate.getYear(); // 获取当前年份(2位)
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var H = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate
    if ("yyyy-mm-dd" == formt) {
        currentdate = year + seperator1 + month + seperator1 + strDate;
    } else {
        currentdate = year + seperator1 + month + seperator1 + strDate + " " + H + seperator2 + m + seperator2 + s;
    }
    return currentdate;
}

//获取星期几
function getWeek(dateStr) {
    var week = ["日", "一", "二", "三", "四", "五", "六"]; //翻译当前星期
    return week[new Date(dateStr).getDay()];
}

/**
 * 将json对象转换拼接为url参数
 * yzb
 * @param data
 */
function jsonToUrlParm(data) {
    var param = Object.keys(data).map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
    }).join("&");
    return param;
}

//返回
$(".icons-left").click(function () {
    window.history.go(-1);
});

// 判断是否为中文
function isChinese(temp) {
    let re = /[\u4e00-\u9fa5]/g;
    return !re.test(temp);
}

//格式化时间
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
        // millisecond
    };
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};

/**
 *判断是否为正数
 * @param num
 * @returns {boolean}
 */
function validate(num) {
    var reg = /^\d+(?=\.{0,1}\d+$|$)/
    if (reg.test(num)) return true;
    return false;
}

// 格式化指定时间
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// 将字符串转时间
function stringToDate(remindTime) {
    if (remindTime == '') {
        return null;
    }
    var str = remindTime.toString();
    str = str.replace("/-/g", "/");
    return new Date(str);
}

// 获取appOrg
function getAppOrg() {
	var appOrg = {};
	ajaxSyncPost('/baseInfo/getByOrgid.action', {}, function (data) {
		appOrg = data;
    });
	
	return appOrg;
}

/**
 * 授权当前页面有支付权限
 */
function initWxJsConfig() {
    ajaxPost('/wx/getConfig.action', {domainName: self.location.href}, function (config) {
        wx.config({
            debug: false, // 开启调试模式，true为开启，false不开启
            appId: config.appid, // 必填，公众号的唯一标识
            timestamp: config.timestamp, // 必填，生成签名的时间戳
            nonceStr: config.nonceStr, // 必填，生成签名的随机串
            signature: config.signature, // 必填，签名，用SHA1加密
            jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard']
        });
    });
}

// 打开地图
function openMap() {
	var data = getAppOrg();
	
    // 经纬度
    var locations = data.org_location.split(',');
    var lat = Number(locations[1]);
    var long = Number(locations[0]);
    wx.ready(function () {
        wx.openLocation({
            latitude: lat, // 纬度，浮点数，范围为90 ~ -90 28.219573
            longitude: long, // 经度，浮点数，范围为180 ~ -180。112.989832
            name: data.org_mc, // 位置名
            address: data.org_dz, // 地址详情说明
            scale: 16, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: data.org_yywz // 在查看位置界面底部显示的超链接,可点击跳转
        });
    });
}
