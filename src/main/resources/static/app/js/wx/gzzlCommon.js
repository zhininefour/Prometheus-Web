var flag = $(".flag").val();
var flag_name = $(".flag_name").val();
//解决苹果手机返回不刷新问题
window.addEventListener('pageshow', function() {
    if(flag != undefined){
        initSelectList(flag);
    }
});

$(function () {
    //日期插件
    initCalendar();
    initAuditFlag();


});

// 初始化码表 及  设置选择的值
function initCodeType(codeType,id,title,input) {
    var inputValue;
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

//列表显示html赋值
function pushToListHtml(param) {
    var html = [];

    var audit_flag_code = param[5];
    var audit_flag = audit_flag_code == 0 ? "未审核" : audit_flag_code == 1 ? "已通过" : audit_flag_code == 2 ? "未通过" : "审核中";
    var id = param[6];

    html.push('<div class="card" onclick="getById(\'' + id + '\'' + ',\'' + audit_flag_code + '\')">');
    html.push('<div class="card-body">');
    html.push('<ul class="list">');
    html.push('<li class="media">');
    // html.push('<label>');
    // html.push('<img class="img-responsive" src="' + param[0] + '"/>');
    // html.push('</label>');
    html.push('<div>');
    html.push('<ul>');
    html.push('<li>' + param[1] + '</li>');
    html.push('<li>' + param[2] + '</li>');
    html.push('<li>' + param[3] + '</li>');
    html.push('<li class="grey">' + param[4] + '</li>');
    html.push('</ul>');
    html.push('</div>');
    html.push('<label></label>');
    html.push('<span>');
    html.push(audit_flag);
    html.push('<button>详细</button>');
    html.push('</span>');
    html.push('</li>');
    html.push('</ul>');
    html.push('</div>');
    html.push('</div>');
    return html;
}

// 格式化日期显示
function formatFormDate(obj) {
    var reDate = '';
    if(obj){
        var date = (obj.replace(/\-/g, "-")).split(" ")[0];
        reDate = date.replace('-', '年').replace('-', '月') + '日';
    }
    return (reDate);
}

//新增表单页面 赋值产品信息
var $glgs_id;
function getTgcpXxById(cp_id) {
    ajaxSyncPost("xcx/CommAction!getTgcpXxById.action", {'cp_id': cp_id}, function (data) {
        var data = data[0];
        if(data != null){
            pushToHtml(data);
            $glgs_id = data.glgs_id;
        }
    });

}
// function getTgcpXx(cpdzid) {
//     ajaxSyncPost("xcx/CommAction!getTgcpXx.action", {'cpdzid': cpdzid}, function (data) {
//         var data = data[0];
//         if(data != null){
//             pushToHtml(data);
//             $glgs_id = data.glgs_id;
//         }
//
//         // $("#glgs_id").val(data.glgs_id);
//         // $("#cso_id").val(data.cso_id);
//     });
//
// }

//获取 上传材料表单信息
function getGzzlInfo(url,biz_id) {
    ajaxSyncPost(url, {'biz_id': biz_id}, function (res) {
        var data = res[0];
        //赋值
        pushToHtml(data);
        $glgs_id = data.glgs_id;

        //单选框处理
        var hz_xb = data.hz_xb;
        if(hz_xb != undefined){
            $("input[name='hz_xb'][value=" + hz_xb + "]").attr("checked",true);
        }
        var blfy_zz = data.blfy_zz;
        if(blfy_zz != undefined){
            $("input[name='blfy_zz'][value=" + blfy_zz + "]").attr("checked",true);
        }

        //图片附件
        queryGzzlImgFileList(biz_id,res[1].ywcj_id);

    });
}

//初始化审核下拉框
function initAuditFlag() {
        var datalist = [
            {
            title: "全部",
            value: "'0','1','2','3','4','5'",
            },
            {
                title: "未审核",
                value: "0",
            },
            {
                title: "审核中",
                value: "'3','4','5'",
            },
            {
                title: "已通过",
                value: "1",
            },
            {
                title: "未通过",
                value: "2"
            }];
        var selectConfig = {
            title: "选择审核状态",
            items: datalist,
            multi: false,
            beforeClose: function (values) {
                // console.log(values);
                initSelectList(values);
            }
        };
        selectConfig.input = flag_name;//设置初始值
        $('#shbz').attr("data-values",flag);
        $('#shbz').select(selectConfig);
}

//重新发起审批
function restartTraceByTable(tableName) {
    $.confirm({
        title: '确认信息',
        text: '您确认已保存吗？',
        onOK: function () {
            var param = {};
            param['glgs_id'] = $glgs_id;
            param['biz_id'] = biz_id;
            param['tableName'] = tableName;

            ajaxPost("xcx/CommAction!restartTrace.action", param, function (data) {
                $.alert(data, function () {
                    window.history.go(-1);
                });

            })
        },
        onCancel: function () {
        }
    });
}

//获取登录人员姓名
function getUserName(ry_id){
	var userName = "";
	ajaxSyncPost("xcx/CommAction!getUserName.action",{'ry_id':ry_id},function(data){
		userName = data;
		
	});
	return userName;
}

//无数据 显示图片
function nullData() {
    var nullHtml = '<div style="text-align: center;">';
    nullHtml += '<img style="margin: .6rem 0 .2rem;" src="../../img/null.png" />';
    nullHtml += '</div>';

    $('#collection').html(nullHtml);
    $('.um-vp').removeAttr('style');//去掉背景色

}

//显示 上传组件  html  代码
function initUploadImgHtml() {

    var htmlLi = [];
    htmlLi.push('<li style="padding: 0px;margin-left: 5px;margin-right: 5px;">');
    htmlLi.push('<div class="weui-cells weui-cells_form" style="margin: 0px;">');
    htmlLi.push('<div class="weui-cell__bd">');
    htmlLi.push('<div class="weui-uploader">');
    htmlLi.push('<div class="weui-uploader__hd">');
    htmlLi.push('<p class="weui-uploader__title  ">&nbsp;图片上传 </p>');
    htmlLi.push('<div class="weui-uploader__info" style="text-align: right;">0/3</div>');
    htmlLi.push('</div>');
    htmlLi.push('<div class="weui-uploader__bd">');
    htmlLi.push('<ul class="weui-uploader__files" id="uploaderFiles"></ul>');
    htmlLi.push('<div class="weui-uploader__input-box" style="    margin-left: 5px;">');
    htmlLi.push('<input id="uploaderInput" name="files" class="weui-uploader__input" type="file" accept="image/*" multiple="true">');
    htmlLi.push('</div></div></div></div></div></li>');

    var htmlDiv = [];
    htmlDiv.push('<div class="weui-gallery" style="display: none">');
    htmlDiv.push('<span class="weui-gallery__img" onclick="closeImg()" ></span>');
    htmlDiv.push('<div class="weui-gallery__opr">');
    
    htmlDiv.push('<div style="width: 50%;position: absolute;border-right: 1px solid #4e4c4c;">');
  	htmlDiv.push('	<a href="javascript:void(0);" class="weui-gallery__del" onclick="deleteImg()">');
	htmlDiv.push('      	<i class="weui-icon-delete weui-icon_gallery-delete"></i>');
	htmlDiv.push('    </a>');
  	htmlDiv.push('</div>');
  	htmlDiv.push('<div style="width: 50%;float: right;">');
  	htmlDiv.push('	<a style="color:white;" href="javascript:void(0);" onclick="closeImg()" class="weui-gallery__del">');
	htmlDiv.push('      	关闭');
	htmlDiv.push('    </a>');
  	htmlDiv.push('</div>');
    
    htmlDiv.push('</div>');
    htmlDiv.push('</div>');

    $(".list").append(htmlLi.join(''));
    $("#collection-details").append(htmlDiv.join(''));


}

// 上传 图片
function uploadImg() {
    var fileInput = $('#uploaderInput');
    // 图片
    $('#uploaderInput').change(function(){
        try {
            var filePath = $(this).val();
            if (filePath) {
                var files = this.files;
                var imgs = $('#uploaderFiles img');
                if (!imgs || imgs.length == 3 || (files.length + imgs.length > 3)) {
                    $.alert('最多上传3张照片');
                    return;
                }

                for (var i = 0; i < files.length; i++) {
                    if (files[0].size > 10 * 1024 * 1024) {
                        $.toptip('上传图片大小不能超过10M');
                        $(this).val('');
                        return ;
                    }
                }

                for (var i = 0; i < files.length; i++) {
					var reader = new FileReader();  
      				reader.onload = function (e) {
      					var img = new Image();
			            img.src = e.target.result;  
			            img.onload = function() {
			            	var width = 0;
	                    	var height = 0;
	                    	
	                    	if (this.naturalWidth && this.naturalHeight) {
	                    		width = this.naturalWidth;
	                    		height = this.naturalHeight;
	                    	} else if(this.width && this.height){
	                    		width = this.width;
	                    		height = this.height;
	                    	}
	                    	
	                    	if (width == 0 || width > 1200) {  
			                    width = 1200;  
			                } 
			                if (height == 0 || height > 1200) {
			                    height = 1200;  
			                } 
	                    	
	                    	var myorientation = 0;
		                    EXIF.getData(this, function() {
		                        //图片方向角  
		                        var Orientation = null;
		                        // alert(EXIF.pretty(this));  
		                        EXIF.getAllTags(this);
		                        //alert(EXIF.getTag(this, 'Orientation')); 
		                        myorientation = EXIF.getTag(this, 'Orientation');
		
								// render方法的maxWith，maxHeight,以及quality都决定了压缩图片的质量
			             		var resImg = document.createElement("img");
		                        var mpImg = new MegaPixImage(this);
		                        mpImg.render(resImg, {quality: 0.7, orientation: myorientation, maxWidth:width, maxHeight:height}, function(){
									ajaxPost('xcx/CommAction!uploadImgBase64.action', {base64:resImg.src}, function(res) {
										$(resImg).attr({'data':'hide','data-src':res, 'src':resImg.src});
										$(resImg).css({'width':'100%', 'height':'100%'});
										
										var imgHtml = '<li class="weui-uploader__file" style="padding:0px;width:20%">';
											imgHtml += $(resImg)[0].outerHTML;
											imgHtml += '</li>';
						   	    		$("#uploaderFiles").append(imgHtml);
						   	    		
						   	    		var len = $('#uploaderFiles img').length;
										if (len >= 3) {
											$('#uploaderInput').attr('disabled',"true");
										}
						   	    		$('.weui-uploader__info').text(len + '/3');
									});
				                }); 
		                    });
			            };
      				};
					
                	reader.readAsDataURL(files[i]);  
				}
            }
        } catch(e) {
            $.toptip('上传图片异常：' + e.message);
        } finally {
            fileInput.attr('id','uploaderInput').val('');
            $('#uploaderInput').replaceWith(fileInput);
        }
    });

    $('body').on('click', '#uploaderFiles img', function(){
        $(this).attr('data', 'show');
        var src = $(this).attr('src');
        $('.weui-gallery__img').css( 'background-image' ,'url('+src.replace(/\s/g,"")+') ');//src 格式有问题  中间有空格，要去掉
        // $('.weui-gallery__img').attr( 'style' ,'background-image:url('+src.replace(/\s/g,"")+') ');
        $('.weui-gallery').fadeIn();
    });
}

//关闭图片
function closeImg() {
    $('#uploaderFiles img').each(function(){
        $(this).attr('data', 'hide');
    });
    $('.weui-gallery').fadeOut();
}
//删除图片
function deleteImg() {
    $.confirm({
        title: '确认删除',
        text: '您确定要删除该张照片吗?',
        onOK: function () {
            $('#uploaderFiles img').each(function(){
                if ($(this).attr('data') == 'show') {
                    //删除 服务器的文件
                    var url = $(this).attr("data-src");
                    ajaxPost('xcx/CommAction!deleteUploadImg.action', {'url':url}, function(res) {

                    });

                    $(this).parent().remove();
                    var len = $('#uploaderFiles img').length;
                    $('.weui-uploader__info').text(len + '/3');
                    if (len < 3) {
                        $('#uploaderInput').removeAttr('disabled');
                    }
                    closeImg();



                }
            });
        },
        onCancel: function () {
        }
    });
}

/*查询图片 附件显示 编辑*/
function queryGzzlImgFileList(yw_id,ywcj_id) {
    ajaxPost("xcx/CommAction!queryGzzlImgFileList.action", {'yw_id':yw_id,'ywcj_id':ywcj_id}, function(res){

        // render方法的maxWith，maxHeight,以及quality都决定了压缩图片的质量
        for(var i = 0 ;i < res.length ;i++){
            var src =  "data:image/jpeg;base64," + res[i].base64;
            var url =  res[i].fjdz + '/' + res[i].fjccmc ;
            var resImg = document.createElement("img");
            $(resImg).attr({'data':'hide','data-src':url, 'src':src});
            $(resImg).css({'width':'100%', 'height':'100%'});

            var imgHtml = '<li class="weui-uploader__file" style="padding:0px;width:20%">';
            imgHtml += $(resImg)[0].outerHTML;
            imgHtml += '</li>';
            $("#uploaderFiles").append(imgHtml);


        }

        var len = $('#uploaderFiles img').length;
        if (len >= 3) {
            $('#uploaderInput').attr('disabled',"true");
        }
        $('.weui-uploader__info').text(len + '/3');

    });
}

// 推广单位  下拉框
function initTgdwList(cp_id,id,title,input) {
    var inputValue;
    ajaxPost("xcx/CommAction!queryTgdwList.action", {'cp_id': cp_id,'glgs_id':$glgs_id}, function (data) {
        var datalist = [];
        for (var i = 0; i < data.length; i++) {
            var info = {
                "title": data[i].tgdw_mc,
                "value": data[i].tgdw_id,
                "data-values": data[i].tgdw_id,
                "csjs_id": data[i].csjs_id,
                "csjs_name": data[i].csjs_name,
                "tgdw_dj": data[i].tgdw_dj,
                "tgdw_djmc": data[i].tgdw_djmc,
                "prov_id": data[i].prov_id,
                "prov_name": data[i].prov_name,
                "city_id": data[i].city_id,
                "city_name": data[i].city_name,
                "area_id": data[i].area_id,
                "area_name": data[i].area_name
            };
            if(input != undefined && input == data[i].tgdw_id){
                $('#' + id).attr('data-values', data[i].tgdw_id);//设置 value值。PS：attr(属性，值)
                inputValue =  data[i].tgdw_mc;
            }
            datalist.push(info);
        }
        var selectConfig = {
            title: title,
            items: datalist,
            multi: false,
            onChange: initCsjs
        };
        selectConfig.input = inputValue;//设置初始值
        $('#'+ id +'').select(selectConfig);
    });


}
//不带推广单位的 查询 代表能推广的城市 下拉框
function initYdSdCsList(cp_id,id,title,input) {
    var inputValue;
    ajaxPost("xcx/CommAction!queryYdSdCsList.action", {'cp_id': cp_id,'glgs_id':$glgs_id}, function (data) {
        var datalist = [];
        if(data.length > 0){
            for (var i = 0; i < data.length; i++) {
                var info = {
                    "title": data[i].csjs_name,
                    "value": data[i].csjs_id,
                    "data-values": data[i].csjs_id
                };
                if(input != undefined && input == data[i].csjs_id){
                    $('#' + id).attr('data-values', data[i].csjs_id);//设置 value值。PS：attr(属性，值)
                    inputValue =  data[i].csjs_name;
                }
                datalist.push(info);
            }
        }else{
            datalist.push('');
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
//根据推广单位直接查询 城市 填充input框
function initCsjs(result) {
    var data = result.origins[0];
    if(data){
        $("#csjs_id").val(data.csjs_id);
        $("#csjs_name").val(data.csjs_name);

        $("#tgdw_dj").val(data.tgdw_dj);
        $("#tgdw_djmc").val(data.tgdw_djmc);

        $("#prov_id").val(data.prov_id);
        $("#prov_name").val(data.prov_name);
        $("#city_id").val(data.city_id);
        $("#city_name").val(data.city_name);
        $("#area_id").val(data.area_id);
        $("#area_name").val(data.area_name);
    }
}


