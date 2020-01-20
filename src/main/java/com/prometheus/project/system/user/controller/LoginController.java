package com.prometheus.project.system.user.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.prometheus.common.constant.LoginType;
import com.prometheus.framework.shiro.token.LoginTypeToken;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.prometheus.common.utils.ServletUtils;
import com.prometheus.common.utils.StringUtils;
import com.prometheus.framework.web.controller.BaseController;
import com.prometheus.framework.web.domain.AjaxResult;

/**
 * 登录验证
 *
 * @author chenzhi
 */
@Controller
public class LoginController extends BaseController {
    @GetMapping("/login")
    public String login(HttpServletRequest request, HttpServletResponse response) {
        // 如果是Ajax请求，返回Json字符串。
        if (ServletUtils.isAjaxRequest(request)) {
            return ServletUtils.renderString(response, "{\"code\":\"1\",\"msg\":\"未登录或登录超时。请重新登录\"}");
        }

        return "login";
    }

    @PostMapping("/login")
    @ResponseBody
    public AjaxResult ajaxLogin(String username, String password, Boolean rememberMe) {
        //0.获取自定义的令牌
        LoginTypeToken token = new LoginTypeToken(username, password, LoginType.WEB, rememberMe);
//        UsernamePasswordToken token = new UsernamePasswordToken(username, password, rememberMe);
        //1.得到subject对象
        Subject subject = SecurityUtils.getSubject();
        try {
            //2.登录认证，调用WebRealm中的认证方法 doGetAuthenticationInfo
            subject.login(token);
            return success();
            //成功后，要页面上找shiro:hasPermission标签，获取权限，在WebRealm中的doGetAuthorizationInfo方法
        } catch (AuthenticationException e) {
            String msg = "用户或密码错误";
            if (StringUtils.isNotEmpty(e.getMessage())) {
                msg = e.getMessage();
            }
            return error(msg);
        }
    }

    @GetMapping("/unauth")
    public String unauth() {
        return "error/unauth";
    }
}
