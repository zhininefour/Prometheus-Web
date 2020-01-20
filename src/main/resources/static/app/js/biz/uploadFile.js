'use strict';
$(function () {
    //上传图片
    $('#uploaderInput').change(function(){
        let files = this.files;
    // $("#uploaderInput").on("change", function (e) {
    //     var files = e.target.files;
        let imgs = $('#uploaderFiles img');
        if (!imgs || imgs.length === 3 || (files.length + imgs.length > 3)) {
            $.alert('最多上传3张照片');
            return;
        }
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (file.size > 10 * 1024 * 1024) {
                $.toptip('上传图片大小不能超过10M');
                $(this).val('');
                return;
            }
            //显示缩略图 初始化点击放大
            let index = file.lastModified;
            renderImg(file, index);
            filesMap.set("" + index + "", file);
        }
    });

//图片放大操作
    $('body').on('click', '#uploaderFiles img', function () {
        $(this).attr('data', 'show');
        let src = $(this).attr('src');
        $('.weui-gallery__img').css('background-image', 'url(' + src.replace(/\s/g, "") + ') ');//src 格式有问题  中间有空格，要去掉
        $('.weui-gallery').fadeIn();
    });
});

//预览全图初始化
function renderImg(file, index) {
    let reader = new FileReader();
    reader.onload = function (e) {
        let img = new Image();
        img.src = e.target.result;
        img.onload = function () {
            let width = 0, height = 0;
            if (this.naturalWidth && this.naturalHeight) {
                width = this.naturalWidth;
                height = this.naturalHeight;
            } else if (this.width && this.height) {
                width = this.width;
                height = this.height;
            }
            if (width == 0 || width > 1200) {
                width = 1200;
            }
            if (height == 0 || height > 1200) {
                height = 1200;
            }
            let myorientation = 0;
            EXIF.getData(this, function () {
                EXIF.getAllTags(this);
                myorientation = EXIF.getTag(this, 'Orientation');
                // render方法的maxWith，maxHeight,以及quality都决定了压缩图片的质量
                let resImg = document.createElement("img");
                let mpImg = new MegaPixImage(this);
                mpImg.render(resImg, {
                    quality: 0.7,
                    orientation: myorientation,
                    maxWidth: width,
                    maxHeight: height
                }, function () {
                    $(resImg).attr({'data': 'hide', 'src': resImg.src, 'id': index});
                    $(resImg).css({'width': '100%', 'height': '100%'});
                    let imgHtml = '<li class="weui-uploader__file">';
                    imgHtml += $(resImg)[0].outerHTML;
                    imgHtml += '</li>';
                    $("#uploaderFiles").append(imgHtml);
                    let len = $('#uploaderFiles img').length;
                    if (len >= 1) {
                        $('#uploaderInput').attr('disabled', "true");
                    }
                    $('.weui-uploader__info').text(len + '/3');
                });
            });
        };
    };
    reader.readAsDataURL(file);
}

//关闭照片弹出层
function closeImg() {
    $('#uploaderFiles img').each(function () {
        $(this).attr('data', 'hide');
    });
    $('.weui-gallery').fadeOut();
}

//删除照片
function deleteImg() {
    $.confirm({
        title: '确认删除',
        text: '您确定要删除该张照片吗?',
        onOK: function () {
            $('#uploaderFiles img').each(function () {
                if ($(this).attr('data') == 'show') {
                    $(this).parent().remove();
                    filesMap.delete($(this).attr('id'));
                    let len = $('#uploaderFiles img').length;
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

//上传图片到服务器
function uploadImg() {
    $('#uploaderFiles img').each(function(){
        let id = $(this).attr('id');
        let data = new FormData();
        data.append("file", filesMap.get(id));
        $.ajax({
            type: "POST",
            url: ctx + "app/common/upload",
            data: data,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function (result) {
                if (result.code === 0) {
                    if(result.url){
                        $("#" + id).attr({'data': 'hide', 'data-src': result.url});
                        photoArray.push(result.fileName);//相对路径 /profile/upload/2019/12/25/6b4577ed58632402924286410c94bb0c.jpg
                    }
                } else {
                    $.alert("图片上传失败。");
                    return false;
                }
            },
            error: function (error) {
                $.alert("图片上传失败。");
                return false;
            }
        });
    });
    return true;
}

//清空选择的图片
function clearUploader() {
    $('#uploaderFiles img').each(function(){
        $(this).parent().remove();
        filesMap.delete($(this).attr('id'));
        $('.weui-uploader__info').text('0/3');
        $('#uploaderInput').removeAttr('disabled');
        photoArray = [];
    });
}