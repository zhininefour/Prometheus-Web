package com.prometheus.project.monitor.logininfo.controller;

import java.util.List;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.prometheus.common.utils.poi.ExcelUtil;
import com.prometheus.framework.aspectj.lang.annotation.Log;
import com.prometheus.framework.aspectj.lang.enums.BusinessType;
import com.prometheus.framework.shiro.service.PasswordService;
import com.prometheus.framework.web.controller.BaseController;
import com.prometheus.framework.web.domain.AjaxResult;
import com.prometheus.framework.web.page.TableDataInfo;
import com.prometheus.project.monitor.logininfo.domain.LoginInfo;
import com.prometheus.project.monitor.logininfo.service.ILoginInfoService;

/**
 * 系统访问记录
 * 
 * @author chenzhi
 */
@Controller
@RequestMapping("/monitor/logininfor")
public class LoginInfoController extends BaseController
{
    private String prefix = "monitor/logininfor";

    @Autowired
    private ILoginInfoService logininforService;

    @Autowired
    private PasswordService passwordService;

    @RequiresPermissions("monitor:logininfor:view")
    @GetMapping()
    public String logininfor()
    {
        return prefix + "/logininfor";
    }

    @RequiresPermissions("monitor:logininfor:list")
    @PostMapping("/list")
    @ResponseBody
    public TableDataInfo list(LoginInfo logininfor)
    {
        startPage();
        List<LoginInfo> list = logininforService.selectLoginInfoList(logininfor);
        return getDataTable(list);
    }

    @Log(title = "登陆日志", businessType = BusinessType.EXPORT)
    @RequiresPermissions("monitor:logininfor:export")
    @PostMapping("/export")
    @ResponseBody
    public AjaxResult export(LoginInfo logininfor)
    {
        List<LoginInfo> list = logininforService.selectLoginInfoList(logininfor);
        ExcelUtil<LoginInfo> util = new ExcelUtil<LoginInfo>(LoginInfo.class);
        return util.exportExcel(list, "登陆日志");
    }

    @RequiresPermissions("monitor:logininfor:remove")
    @Log(title = "登陆日志", businessType = BusinessType.DELETE)
    @PostMapping("/remove")
    @ResponseBody
    public AjaxResult remove(String ids)
    {
        return toAjax(logininforService.deleteLoginInfoByIds(ids));
    }

    @RequiresPermissions("monitor:logininfor:remove")
    @Log(title = "登陆日志", businessType = BusinessType.CLEAN)
    @PostMapping("/clean")
    @ResponseBody
    public AjaxResult clean()
    {
        logininforService.cleanLoginInfo();
        return success();
    }

    @RequiresPermissions("monitor:logininfor:unlock")
    @Log(title = "账户解锁", businessType = BusinessType.OTHER)
    @PostMapping("/unlock")
    @ResponseBody
    public AjaxResult unlock(String loginName)
    {
        passwordService.unlock(loginName);
        return success();
    }
}
