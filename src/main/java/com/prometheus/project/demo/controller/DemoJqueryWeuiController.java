package com.prometheus.project.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Jquery-WeUI 框架示例
 *
 * @author chenzhi
 */
//@CrossOrigin(origins = "http://ruoyi.vip", maxAge = 3600) //整个控制器启用CORS注解
@Controller
@RequestMapping("/demo/jquery-weui")
public class DemoJqueryWeuiController {
    private String prefix = "demo/jquery-weui";

    /**
     * Jquery-WeUI框架示例
     */
    @CrossOrigin //单个控制器方法CORS注解
    @GetMapping("/index")
    public String index() {
        return prefix + "/index";
    }


}
