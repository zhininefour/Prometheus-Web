/**
 * 通用方法封装处理
 * Copyright (c) 2019 prometheus
 */
$(function() {

	//  layer扩展皮肤
	if (window.layer !== undefined) {
		layer.config({
		    extend: 'moon/style.css',
		    skin: 'layer-ext-moon'
		});
	}

	// select2复选框事件绑定
	if ($.fn.select2 !== undefined) {
        $.fn.select2.defaults.set( "theme", "bootstrap" );
		$("select.form-control:not(.noselect2)").each(function () {
			$(this).select2().on("change", function () {
				$(this).valid();
			})
		})
	}

	// iCheck单选框及复选框事件绑定
	if ($.fn.iCheck !== undefined) {
		$(".check-box:not(.noicheck),.radio-box:not(.noicheck)").each(function() {
            $(this).iCheck({
                checkboxClass: 'icheckbox-blue',
                radioClass: 'iradio-blue',
            })
        })
	}

	// laydate 时间控件绑定
	if ($(".select-time").length > 0) {
		layui.use('laydate', function() {
		    var laydate = layui.laydate;
		    var startDate = laydate.render({
		        elem: '#startTime',
		        max: $('#endTime').val(),
		        theme: 'molv',
		        trigger: 'click',
		        done: function(value, date) {
		            // 结束时间大于开始时间
		            if (value !== '') {
		                endDate.config.min.year = date.year;
		                endDate.config.min.month = date.month - 1;
		                endDate.config.min.date = date.date;
		            } else {
		                endDate.config.min.year = '';
		                endDate.config.min.month = '';
		                endDate.config.min.date = '';
		            }
		        }
		    });
		    var endDate = laydate.render({
		        elem: '#endTime',
		        min: $('#startTime').val(),
		        theme: 'molv',
		        trigger: 'click',
		        done: function(value, date) {
		            // 开始时间小于结束时间
		            if (value !== '') {
		                startDate.config.max.year = date.year;
		                startDate.config.max.month = date.month - 1;
		                startDate.config.max.date = date.date;
		            } else {
		                startDate.config.max.year = '';
		                startDate.config.max.month = '';
		                startDate.config.max.date = '';
		            }
		        }
		    });
		});
	}
	// laydate time-input 时间控件绑定
	if ($(".time-input").length > 0) {
		layui.use('laydate', function () {
			var com = layui.laydate;
			$(".time-input").each(function (index, item) {
				var time = $(item);
				// 控制控件外观
				var type = time.attr("data-type") || 'date';
				// 控制回显格式
				var format = time.attr("data-format") || 'yyyy-MM-dd';
				// 控制日期控件按钮
				var buttons = time.attr("data-btn") || 'clear|now|confirm', newBtnArr = [];
				// 日期控件选择完成后回调处理
				var callback = time.attr("data-callback") || {};
				if (buttons) {
					if (buttons.indexOf("|") > 0) {
						var btnArr = buttons.split("|"), btnLen = btnArr.length;
						for (var j = 0; j < btnLen; j++) {
							if ("clear" === btnArr[j] || "now" === btnArr[j] || "confirm" === btnArr[j]) {
								newBtnArr.push(btnArr[j]);
							}
						}
					} else {
						if ("clear" === buttons || "now" === buttons || "confirm" === buttons) {
							newBtnArr.push(buttons);
						}
					}
				} else {
					newBtnArr = ['clear', 'now', 'confirm'];
				}
				com.render({
					elem: item,
					theme: 'molv',
					trigger: 'click',
					type: type,
					format: format,
					btns: newBtnArr,
					done: function (value, data) {
						if (typeof window[callback] != 'undefined'
							&& window[callback] instanceof Function) {
							window[callback](value, data);
						}
					}
				});
			});
		});
	}
	// tree 关键字搜索绑定
	if ($("#keyword").length > 0) {
		$("#keyword").bind("focus", function focusKey(e) {
		    if ($("#keyword").hasClass("empty")) {
		        $("#keyword").removeClass("empty");
		    }
		}).bind("blur", function blurKey(e) {
		    if ($("#keyword").val() === "") {
		        $("#keyword").addClass("empty");
		    }
		    $.tree.searchNode(e);
		}).bind("input propertychange", $.tree.searchNode);
	}
	// tree表格树 展开/折叠
	var expandFlag;
	$("#expandAllBtn").click(function() {
		var dataExpand = $.common.isEmpty(table.options.expandAll) ? true : table.options.expandAll;
		expandFlag = $.common.isEmpty(expandFlag) ? dataExpand : expandFlag;
	    if (!expandFlag) {
	    	$.bttTable.bootstrapTreeTable('expandAll');
	    } else {
	    	$.bttTable.bootstrapTreeTable('collapseAll');
	    }
	    expandFlag = expandFlag ? false: true;
	})
	// 按下ESC按钮关闭弹层
	$('body', document).on('keyup', function(e) {
	    if (e.which === 27) {
	        $.modal.closeAll();
	    }
	});
});

/** 刷新选项卡 */
var refreshItem = function(){
    var topWindow = $(window.parent.document);
	var currentId = $('.page-tabs-content', topWindow).find('.active').attr('data-id');
	var target = $('.RuoYi_iframe[data-id="' + currentId + '"]', topWindow);
    var url = target.attr('src');
    target.attr('src', url).ready();
}

/** 关闭选项卡 */
var closeItem = function(dataId){
	var topWindow = $(window.parent.document);
	if($.common.isNotEmpty(dataId)){
		window.parent.$.modal.closeLoading();
		// 根据dataId关闭指定选项卡
		$('.menuTab[data-id="' + dataId + '"]', topWindow).remove();
		// 移除相应tab对应的内容区
		$('.mainContent .RuoYi_iframe[data-id="' + dataId + '"]', topWindow).remove();
		return;
	}
	var panelUrl = window.frameElement.getAttribute('data-panel');
	$('.page-tabs-content .active i', topWindow).click();
	if($.common.isNotEmpty(panelUrl)){
		$('.menuTab[data-id="' + panelUrl + '"]', topWindow).addClass('active').siblings('.menuTab').removeClass('active');
		$('.mainContent .RuoYi_iframe', topWindow).each(function() {
            if ($(this).data('id') == panelUrl) {
                $(this).show().siblings('.RuoYi_iframe').hide();
                return false;
            }
		});
	}
}

/** 创建选项卡 */
function createMenuItem(dataUrl, menuName) {
	var panelUrl = window.frameElement.getAttribute('data-id');
    dataIndex = $.common.random(1,100),
    flag = true;
    if (dataUrl == undefined || $.trim(dataUrl).length == 0) return false;
    var topWindow = $(window.parent.document);
    // 选项卡菜单已存在
    $('.menuTab', topWindow).each(function() {
        if ($(this).data('id') == dataUrl) {
            if (!$(this).hasClass('active')) {
                $(this).addClass('active').siblings('.menuTab').removeClass('active');
                $('.page-tabs-content').animate({ marginLeft: ""}, "fast");
                // 显示tab对应的内容区
                $('.mainContent .RuoYi_iframe', topWindow).each(function() {
                    if ($(this).data('id') == dataUrl) {
                        $(this).show().siblings('.RuoYi_iframe').hide();
                        return false;
                    }
                });
            }
            flag = false;
            return false;
        }
    });
    // 选项卡菜单不存在
    if (flag) {
        var str = '<a href="javascript:;" class="active menuTab" data-id="' + dataUrl + '" data-panel="' + panelUrl + '">' + menuName + ' <i class="fa fa-times-circle"></i></a>';
        $('.menuTab', topWindow).removeClass('active');

        // 添加选项卡对应的iframe
        var str1 = '<iframe class="RuoYi_iframe" name="iframe' + dataIndex + '" width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" data-panel="' + panelUrl + '" seamless></iframe>';
        $('.mainContent', topWindow).find('iframe.RuoYi_iframe').hide().parents('.mainContent').append(str1);

        window.parent.$.modal.loading("数据加载中，请稍后...");
        $('.mainContent iframe:visible', topWindow).load(function () {
        	window.parent.$.modal.closeLoading();
        });

        // 添加选项卡
        $('.menuTabs .page-tabs-content', topWindow).append(str);
    }
    return false;
}

//日志打印封装处理
var log = {
    log: function(msg) {
        console.log(msg);
    },
    info: function(msg) {
        console.info(msg);
    },
    warn: function(msg) {
        console.warn(msg);
    },
    error: function(msg) {
        console.error(msg);
    }
};

//本地缓存处理
var storage = {
    set: function(key, value) {
        window.localStorage.setItem(key, value);
    },
    get: function(key) {
        return window.localStorage.getItem(key);
    },
    remove: function(key) {
        window.localStorage.removeItem(key);
    },
    clear: function() {
        window.localStorage.clear();
    }
};

/** 设置全局ajax处理 */
$.ajaxSetup({
    complete: function(XMLHttpRequest, textStatus) {
        if (textStatus == 'timeout') {
        	$.modal.alertWarning("服务器超时，请稍后再试！");
        	$.modal.enable();
            $.modal.closeLoading();
        } else if (textStatus == "parsererror" || textStatus == "error") {
        	$.modal.alertWarning("服务器错误，请联系管理员！");
        	$.modal.enable();
            $.modal.closeLoading();
        }
    }
});
/*layui.use('laydate', function() {
    var laydate = layui.laydate;
    //年选择器
    laydate.render({
        elem: '#year'
        ,type: 'year'
    });
    //年月选择器
    laydate.render({
        elem: '#month'
        ,type: 'month',
        format: 'MM'
    });
    //常规用法 日期选则
    laydate.render({
        elem: '#day'
    });
    //时间选择器
    laydate.render({
        elem: '#time'
        ,type: 'time'
    });

    //日期时间选择器
    laydate.render({
        elem: '.datetime'
        ,type: 'datetime'
    });
    //选择时间
    laydate.render({
        elem: '.time-format'
        ,type: 'time'
        ,format: 'HH:mm'
        ,trigger: 'click'
    });
    //选择时间
    laydate.render({
        elem: '.time-format-second'
        ,type: 'time'
        ,format: 'HH:mm:ss'
        ,trigger: 'click'

    });
    //选择时间 多个
    lay('.time-format-second-item').each(function(){
        laydate.render({
            elem: this
            ,type: 'time'
            ,format: 'HH:mm:ss'
            ,trigger: 'click'
        });
    });
    //同时绑定多个
    lay('.time-format-item').each(function(){
        laydate.render({
            elem: this
            ,type: 'time'
            ,format: 'HH:mm'
            ,trigger: 'click'
        });
    });


    //年范围
    laydate.render({
        elem: '#range-year'
        ,type: 'year'
        ,range: true
    });
    //年月范围
    laydate.render({
        elem: '#range-yearMonth'
        ,type: 'month'
        ,range: true,
        done: function(value, date){
            var arr = value.split(" - ");
            $("#beginTime").val(arr[0]);
            $("#endTime").val(arr[1]);
        }
    });
    //日期范围
    laydate.render({
        elem: '#range-yearMonthDay'
        ,range: true,
		done: function(value, date){
            var arr = value.split(" - ");
            $("#beginTime").val(arr[0]);
            $("#endTime").val(arr[1]);
        }
    });
    //时间范围
    laydate.render({
        elem: '#range-datetime'
        ,type: 'time'
        ,range: true,
        done: function(value, date){
            var arr = value.split(" - ");
            $("#beginTime").val(arr[0]);
            $("#endTime").val(arr[1]);
        }
    });

    //日期时间范围
    laydate.render({
        elem: '#range-yearMonthDay-datetime'
        ,type: 'datetime'
        ,range: true,
        done: function(value, date){
            var arr = value.split(" - ");
            $("#beginTime").val(arr[0]);
            $("#endTime").val(arr[1]);
        }
    });*/


/*layer.config({
	extend: 'moon/style.css',
	skin: 'layer-ext-moon'
});

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt)
{ //author: meizz
	var o = {
		"M+" : this.getMonth()+1,                 //月份
		"d+" : this.getDate(),                    //日
		"H+" : this.getHours(),                   //小时
		"m+" : this.getMinutes(),                 //分
		"s+" : this.getSeconds(),                 //秒
		"q+" : Math.floor((this.getMonth()+3)/3), //季度
		"S"  : this.getMilliseconds()             //毫秒
	};
	if(/(y+)/.test(fmt))
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("("+ k +")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	return fmt;
}*/