'use strict';
$(function () {
    FastClick.attach(document.body);
    //初始化必选样式
    initRequiredSpan();
});


//根据请求url中的key获取value值
function request(key) {
    let searchUrl = window.location.search.replace("?", ""),
        keyArray = searchUrl.split("&"),
        keyStr = "",
        keyIndex = -1;
    for (let i = 0; i < keyArray.length; i++) {
        keyIndex = keyArray[i].indexOf("=");
        keyStr = keyArray[i].substring(0, keyIndex);
        if (keyStr == key) {
            return keyArray[i].substring(keyIndex + 1, keyArray[i].length);
        }
    }
    return null;
}

//获取url中的参数，返回参数数据结构化对象
function getParams() {
    let searchUrl = window.location.search;
    searchUrl = searchUrl.substring(1, searchUrl.length);//jzid=123&yeid=3
    let paramArray = searchUrl.split("&"),
        paramMap = {};
    for (let i in paramArray) {
        let paramStr = paramArray[i],
            keyValue = paramStr.split("=");
        let value = keyValue[1];
        paramMap["" + keyValue[0]] = isChinese(value) === true ? decodeURI(value) : value;
    }
    return paramMap;
}

/**
 * jquery ajax请求方法
 * @param {Object} url        ajax请求url
 * @param {Object} type        ajax请求类型：POST/GET
 * @param {Object} async        ajax请求是否异步：true/false
 * @param {Object} params    ajax请求参数
 * @param {Object} callBack    ajax回调函数
 */
function ajax(url, type, async, params, callBack) {
    $.ajax({
        url: url,
        type: type,
        dataType: 'JSON',
        timeout: 60000,
        async: async,
        data: params,
        success: function (data) {
            if (data.code !== undefined && data.code === 0) {
                callBack(data);
            } else {
                $.toptip(data.msg, 'error');
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if ('error' === textStatus) {
                $.toptip('网络异常', 'error');
            }
        }
    });
}

/**
 * jquery ajax请求Get异步方式
 * @param {Object} url
 * @param {Object} params
 * @param {Object} callBack
 */
function ajaxGet(url, params, callBack) {
    ajax(url, 'GET', true, params, callBack);
}

/**
 * jquery ajax请求Post异步方式
 * @param {Object} url
 * @param {Object} params
 * @param {Object} callBack
 */
function ajaxPost(url, params, callBack) {
    ajax(url, 'POST', true, params, callBack);
}

/**
 * jquery ajax请求Get同步方式
 * @param {Object} url
 * @param {Object} params
 * @param {Object} callBack
 */
function ajaxSyncGet(url, params, callBack) {
    ajax(url, 'GET', false, params, callBack);
}

/**
 * jquery ajax请求Post同步方式
 * @param {Object} url
 * @param {Object} params
 * @param {Object} callBack
 */
function ajaxSyncPost(url, params, callBack) {
    ajax(url, 'POST', false, params, callBack);
}

//为每个页面添加返回按钮
function setBackButton() {
    let id = $('section').attr("id");
    if(id !== 'index'){
        html = '<span class="back" onclick="window.history.go(-1)">返回</span>';
        $('body').append(html);
    }
}

//初始化必选项样式
function initRequiredSpan() {
    $(".prometheus-required-span-div").append("<span class='prometheus-required-span'> *</span>");
}

//验证表单必填项
function validate_form() {
    let inputs = $('.required_input');
    for (let i = 0; i < inputs.length; i ++) {
        if (!inputs[i].value) {
            $.alert(inputs[i].placeholder, function(){
                inputs[i].focus();
            });
            return false;
        }
    }
    return true;
}


//禁用提交按钮
function submitForbidden() {
    $("#submit").css("pointer-events","none");
    $("#submit").addClass("weui-btn_warn weui-btn_loading");
    let html = '<i class="weui-loading" id="loading"></i>';
    $("#submit").prepend(html);
    // $.showLoading();
}

//放开提交按钮
function submitAllowed() {
    $("#submit").css("pointer-events","auto");
    $("#submit").removeClass("weui-btn_warn weui-btn_loading");
    $("#loading").remove();
    // $.hideLoading();
    // history.back(-1);
}



//返回
$(".icons-left").click(function () {
    window.history.go(-1);
});

//textarea 框自适应
function autosize(obj) {
    let el = obj;
    setTimeout(function () {
        el.style.cssText = 'height:auto; padding:0';
        // for box-sizing other than "content-box" use:
        // el.style.cssText = '-moz-box-sizing:content-box';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
    }, 0);
}

//监听textarea输入 限制字符数
/*<textarea class="wishContent" */
$(".wishContent").on('input propertychange', function () {
    //获取输入内容
    let userDesc = $(this).val();
    //判断字数
    let len;
    if (userDesc) {
        len = checkStrLengths(userDesc, 100);
    } else {
        len = 0
    }
    //显示字数
    $(".wordsNum").html(len + '/100');
});

//封装一个限制字数方法
function checkStrLengths(str, maxLength) {
    let result = 0;
    if (str && str.length > maxLength) {
        result = maxLength;
    } else {
        result = str.length;
    }
    return result;
}


