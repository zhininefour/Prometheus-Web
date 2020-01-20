package com.prometheus.common.constant;


/**
 * @description: 登录类型
 * @author: ChenZhi
 * @create: 2019/5/14 16:51
 * @version: 1.0
 **/

public enum  LoginType {
    PASSWORD("password"), // 密码登录
    NOPASSWD("nopassword"), // 免密登录
    WEB("Web"), //网页登录
//    MOBILE("Mobile");//手机登录

//    USER("User"), //网页登录
    APP("App");//手机登录


    private String code;// 状态值

    private LoginType(String code) {
        this.code = code;
    }
    public String getCode () {
        return code;
    }

    @Override
    public String toString() {
        return this.code.toString();
    }
}
