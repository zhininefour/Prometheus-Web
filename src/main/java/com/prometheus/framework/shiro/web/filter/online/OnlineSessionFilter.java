package com.prometheus.framework.shiro.web.filter.online;

import java.io.IOException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.AccessControlFilter;
import org.apache.shiro.web.util.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import com.prometheus.common.constant.ShiroConstants;
import com.prometheus.common.utils.security.ShiroUtils;
import com.prometheus.framework.shiro.session.OnlineSessionDAO;
import com.prometheus.project.monitor.online.domain.OnlineSession;
import com.prometheus.project.system.user.domain.User;

/**
 * 自定义访问控制
 *
 * @author chenzhi
 */
public class OnlineSessionFilter extends AccessControlFilter {
    /**
     * 强制退出后重定向的地址
     */
    @Value("${shiro.user.loginUrl}")
    private String loginUrl;

    @Autowired
    private OnlineSessionDAO onlineSessionDAO;

    /**
     * 判断是否允许访问；这里可以用来判断一些不被通过的链接, mappedValue就是[urls]配置中拦截器参数部分
     * 如果isAccessAllowed返回true则onAccessDenied方法不会继续执行
     * 否则false 到 onAccessDenied 方法处理；
     */
    @Override
    protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue){
        Subject subject = getSubject(request, response);
        if (subject == null || subject.getSession() == null) {
            return true;
        }
        Session session = onlineSessionDAO.readSession(subject.getSession().getId());
        if (session != null && session instanceof OnlineSession) {
            OnlineSession onlineSession = (OnlineSession) session;
            request.setAttribute(ShiroConstants.ONLINE_SESSION, onlineSession);
            // 把user对象设置进去
            boolean isGuest = onlineSession.getUserId() == null || onlineSession.getUserId() == 0L;
            if (isGuest) {
                User user = ShiroUtils.getSysUser();
                if (user != null) {
                    onlineSession.setUserId(user.getUserId());
                    onlineSession.setLoginName(user.getLoginName());
                    onlineSession.setAvatar(user.getAvatar());
                    onlineSession.setDeptName(user.getDept().getDeptName());
                    onlineSession.markAttributeChanged();
                }
            }

            if (onlineSession.getStatus() == OnlineSession.OnlineStatus.off_line) {
                return false;
            }
        }
        return true;
    }

    /**
     * 表示当访问拒绝时是否已经处理了；如果返回true表示需要继续处理；如果返回false表示该拦截器实例已经处理了，将直接返回即可。
     * onAccessDenied是否执行取决于isAccessAllowed的值，
     * 如果返回true则onAccessDenied不会执行；
     * 如果返回false，执行onAccessDenied
     *  如果onAccessDenied也返回false，则直接返回，不会进入请求的方法（
     *
     */
    @Override
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
        Subject subject = getSubject(request, response);
        if (subject != null) {
            subject.logout();
        }
        saveRequestAndRedirectToLogin(request, response);
        return false;
    }

    // 重写AccessControlFilter中的方法 跳转到登录页
    @Override
    protected void redirectToLogin(ServletRequest request, ServletResponse response) throws IOException {
        WebUtils.issueRedirect(request, response, loginUrl);
    }
}
