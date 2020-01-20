package com.prometheus.framework.config;

import com.prometheus.framework.shiro.token.LoginTypeToken;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.credential.SimpleCredentialsMatcher;
import org.springframework.context.annotation.Configuration;

/**
 * @description: 密码验证器 shiro密码匹配，主要判断是否是免密码登录
 * @author: ChenZhi
 * @create: 2019/5/14 17:38
 * @version: 1.0
 **/

@Configuration
public class MyRetryLimitCredentialsMatcher extends SimpleCredentialsMatcher {

    @Override
    public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {
        LoginTypeToken easyTypeToken = (LoginTypeToken) token;
        //如果免登，直接返回true
//        if (easyTypeToken.getType().equals(LoginType.NOPASSWD)) {
//            return true;
//        }
        boolean matches = super.doCredentialsMatch(token, info);
        return matches;
    }


}