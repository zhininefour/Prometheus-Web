$(function() {
  validateKickout();
  validateRule();
  //初始化获取验证码
  getCaptcha();
  $('.imgcode').click(getCaptcha);
});

$.validator.setDefaults({
  submitHandler: function() {
    login();
  }
});

function getCaptcha() {
  var url = ctx + "captcha/captchaImage?type=" + captchaType + "&s=" + Math.random();
  $(".imgcode").attr("src", url);
}

function login() {
  $.modal.loading($("#btnSubmit").data("loading"));
  // clickSubmit(e);
  var username = $.common.trim($("input[name='username']").val());
  var password = $.common.trim($("input[name='password']").val());
  var validateCode = $("input[name='validateCode']").val();
  var rememberMe = $("input[name='rememberme']").is(':checked');
  $.ajax({
    type: "post",
    url: ctx + "login",
    data: {
      "username": username,
      "password": password,
      "validateCode" : validateCode,
      "rememberMe": rememberMe
    },
    success: function(r) {
      if (r.code == 0) {
        location.href = ctx + 'app/index';
      } else {
        $.modal.closeLoading();
        getCaptcha();
        $(".code").val("");
        $.modal.msg(r.msg);
      }
    }
  });
}

function validateRule() {
  var icon = "<i class='fa fa-times-circle'></i> ";
  $("#signupForm").validate({
    rules: {
      username: {
        required: true
      },
      password: {
        required: true
      }
    },
    messages: {
      username: {
        required: icon + "请输入您的用户名",
      },
      password: {
        required: icon + "请输入您的密码",
      }
    }
  })
}

function validateKickout() {
  if (getParam("kickout") == 1) {
    layer.alert("<font color='red'>您已在别处登录，请您修改密码或重新登录</font>", {
          icon: 0,
          title: "系统提示"
        },
        function(index) {
          //关闭弹窗
          layer.close(index);
          if (top != self) {
            top.location = self.location;
          } else {
            var url  =  location.search;
            if (url) {
              var oldUrl  = window.location.href;
              var newUrl  = oldUrl.substring(0,  oldUrl.indexOf('?'));
              self.location  = newUrl;
            }
          }
        });
  }
}

function getParam(paramName) {
  var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}




//
// $(document).ready(function() {
//
//   function ripple(elem, e) {
//     $(".ripple").remove();
//     var elTop = elem.offset().top,
//         elLeft = elem.offset().left,
//         x = e.pageX - elLeft,
//         y = e.pageY - elTop;
//     var $ripple = $("<div class='ripple'></div>");
//     $ripple.css({top: y, left: x});
//     elem.append($ripple);
//   };
//
//
//
//   $(document).on("click", ".app__logout", function(e) {
//     if (animating) return;
//     $(".ripple").remove();
//     animating = true;
//     var that = this;
//     $(that).addClass("clicked");
//     setTimeout(function() {
//       $app.removeClass("active");
//       $login.show();
//       $login.css("top");
//       $login.removeClass("inactive");
//     }, logoutPhase1 - 120);
//     setTimeout(function() {
//       $app.hide();
//       animating = false;
//       $(that).removeClass("clicked");
//     }, logoutPhase1);
//   });
//
// });

function clickSubmit(e){
  var animating = false,
      submitPhase1 = 1100,
      submitPhase2 = 400,
      logoutPhase1 = 800,
      $login = $(".login"),
      $app = $(".app");


  if (animating) return;
  animating = true;
  var that = this;
  ripple($(that), e);
  $(that).addClass("processing");
  setTimeout(function() {
    $(that).addClass("success");
    setTimeout(function() {
      $app.show();
      $app.css("top");
      $app.addClass("active");
    }, submitPhase2 - 70);
    setTimeout(function() {
      $login.hide();
      $login.addClass("inactive");
      animating = false;
      $(that).removeClass("success processing");
    }, submitPhase2);
  }, submitPhase1);
}