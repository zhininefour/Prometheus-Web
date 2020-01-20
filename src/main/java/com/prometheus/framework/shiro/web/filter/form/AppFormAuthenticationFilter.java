package com.prometheus.framework.shiro.web.filter.form;

import com.prometheus.common.constant.LoginType;
import com.prometheus.framework.shiro.token.LoginTypeToken;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.apache.shiro.web.util.WebUtils;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

/**
 * @description: 过滤器  是否免登
 * @author: ChenZhi
 * @create: 2019/5/14 18:56
 * @version: 1.0
 **/

public class AppFormAuthenticationFilter extends FormAuthenticationFilter {

//    @Override
//    protected boolean onAccessDenied(ServletRequest request, ServletResponse response, Object mappedValue)
//            throws Exception {
//        Subject subject = SecurityUtils.getSubject();
//        Session session = subject.getSession();
//        //将版本号保存到session中
//        if (session.getAttribute(Constants.SESSION_VERSION) == null) {
//            session.setAttribute(Constants.SESSION_VERSION,Constants.SESSION_VERSION_NO);
//        }
//        if (request.getAttribute(getFailureKeyAttribute()) != null) {
//            return true;
//        }
//        return super.onAccessDenied(request, response, mappedValue);
//    }

    @Override
    protected boolean onLoginSuccess(AuthenticationToken token, Subject subject, ServletRequest request,
                                     ServletResponse response) throws Exception {
        WebUtils.getAndClearSavedRequest(request);
        WebUtils.redirectToSavedRequest(request, response, "/app/index");// 页面跳转到首页
        return false;
    }

    @Override
    protected LoginTypeToken createToken(ServletRequest request, ServletResponse response) {
        String username = getUsername(request);
        String password = getPassword(request);
        return new LoginTypeToken(username, password, LoginType.APP);
    }


//        String username = getUsername(request);
//        String password = getPassword(request);
//        String rememberMe = getRememberMeParam();
//        String type = request.getParameter("type");
//        if("password".equals(type)){
//            return new EasyTypeToken(username, password,true);
//        } else {
//            return new EasyTypeToken(username);
//        }
//

}