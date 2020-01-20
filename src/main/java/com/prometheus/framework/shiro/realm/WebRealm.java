package com.prometheus.framework.shiro.realm;

import java.util.HashSet;
import java.util.Set;

import com.google.common.collect.Sets;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.ExcessiveAttemptsException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import com.prometheus.common.exception.user.CaptchaException;
import com.prometheus.common.exception.user.RoleBlockedException;
import com.prometheus.common.exception.user.UserBlockedException;
import com.prometheus.common.exception.user.UserNotExistsException;
import com.prometheus.common.exception.user.UserPasswordNotMatchException;
import com.prometheus.common.exception.user.UserPasswordRetryLimitExceedException;
import com.prometheus.common.utils.security.ShiroUtils;
import com.prometheus.framework.shiro.service.LoginService;
import com.prometheus.project.system.menu.service.IMenuService;
import com.prometheus.project.system.role.service.IRoleService;
import com.prometheus.project.system.user.domain.User;

/**
 * 自定义web网页端Realm 处理网页端登录 权限
 * 提供与login(token) 中的token进行比较的数据
 * 一个是shiro 的 subject 调用login方法，根据token类型不同，会调用不同的realm的doGetAuthenticationInfo来鉴权；
 * 一个是调用AccessControlFilter实现类的onAccessDenied之后，如果判断用户可以继续访问就会继续调用realm的doGetAuthorizationInfo授权。
 * @author chenzhi
 */
public class WebRealm extends AuthorizingRealm {
    private static final Logger log = LoggerFactory.getLogger(WebRealm.class);

    @Autowired
    private IMenuService menuService;

    @Autowired
    private IRoleService roleService;

    @Autowired
    private LoginService loginService;

    /**
     * 授权方法
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection arg0) {
        User user = ShiroUtils.getSysUser();
        // 角色列表 功能列表
        Set<String> roles, menus;
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        // 管理员拥有所有权限
        if (user.isAdmin()) {
            info.addRole("admin");
            info.addStringPermission("*:*:*");
        } else {
            roles = roleService.selectRoleKeys(user.getUserId());
            menus = menuService.selectPermsByUserId(user.getUserId());
            // 角色加入AuthorizationInfo认证对象
            info.setRoles(roles);
            // 权限加入AuthorizationInfo认证对象
            info.setStringPermissions(menus);
        }
        return info;
    }

    /**
     * 登录认证方法
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        //获取基于用户名和密码的令牌
        //实际上这个token是从UserResource面currentUser.login(token)传过来的
        //两个token的引用都是一样的
        UsernamePasswordToken upToken = (UsernamePasswordToken) token;
        String username = upToken.getUsername();
        String password = "";
        if (upToken.getPassword() != null) {
            // 获取输入的密码
            password = new String(upToken.getPassword());
        }

        User user = null;
        try {
            //3.对比数据库的用户信息，包括密码验证
            user = loginService.login(username, password);
        } catch (CaptchaException e) {
            throw new AuthenticationException(e.getMessage(), e);
        } catch (UserNotExistsException e) {
            throw new UnknownAccountException(e.getMessage(), e);
        } catch (UserPasswordNotMatchException e) {
            throw new IncorrectCredentialsException(e.getMessage(), e);
        } catch (UserPasswordRetryLimitExceedException e) {
            throw new ExcessiveAttemptsException(e.getMessage(), e);
        } catch (UserBlockedException e) {
            throw new LockedAccountException(e.getMessage(), e);
        } catch (RoleBlockedException e) {
            throw new LockedAccountException(e.getMessage(), e);
        } catch (Exception e) {
            log.info("对用户[" + username + "]进行登录验证..验证未通过{}", e.getMessage());
            throw new AuthenticationException(e.getMessage(), e);
        }
        // 4.用户存在，认证通过，  交给AuthenticatingRealm使用CredentialsMatcher进行密码匹配
        SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(user, password, getName());
        return info;
    }

    /**
     * 清理缓存权限
     */
    public void clearCachedAuthorizationInfo() {
        this.clearCachedAuthorizationInfo(SecurityUtils.getSubject().getPrincipals());
    }
}
