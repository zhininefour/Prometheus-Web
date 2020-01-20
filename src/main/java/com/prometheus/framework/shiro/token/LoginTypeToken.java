package com.prometheus.framework.shiro.token;

import com.prometheus.common.constant.LoginType;
import org.apache.shiro.authc.UsernamePasswordToken;

/**
 * @description: 自定义token 令牌
 * @author: ChenZhi
 * @create: 2019/5/14 16:53
 * @version: 1.0
 **/

public class LoginTypeToken extends UsernamePasswordToken {
    private static final long serialVersionUID = 1L;

    private LoginType loginType;

    public LoginType getLoginType() {
        return loginType;
    }

    public void setLoginType(LoginType loginType) {
        this.loginType = loginType;
    }


    public LoginTypeToken() {
        super();
    }


    public LoginTypeToken(String username, String password, LoginType loginType) {
        super(username, password);
        this.loginType = loginType;
    }

    public LoginTypeToken(String username, String password, LoginType loginType, boolean rememberMe) {
        super(username, password, rememberMe);
        this.loginType = loginType;
    }

    public LoginTypeToken(String username, String password, LoginType loginType, boolean rememberMe, String host) {
        super(username, password, rememberMe, host);
        this.loginType = loginType;
    }

//    public UserPasswordToken(String username, char[] password,String loginType) {
//        super(username, password);
//        this.loginType = loginType;
//    }


    @Override
    public String toString() {
        return this.loginType.toString();
    }
    /**
     * 免密登录
     */
    public LoginTypeToken(String username) {
        super(username, "", false, null);
        this.loginType = LoginType.NOPASSWD;
    }

    /**
     * 账号密码登录
     */
    public LoginTypeToken(String username, String password, boolean rememberMe) {
        super(username, password, rememberMe, null);
        this.loginType = LoginType.PASSWORD;
    }


}
