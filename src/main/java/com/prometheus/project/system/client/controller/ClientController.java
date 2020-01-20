package com.prometheus.project.system.client.controller;

import com.prometheus.common.utils.poi.ExcelUtil;
import com.prometheus.framework.aspectj.lang.annotation.Log;
import com.prometheus.framework.aspectj.lang.enums.BusinessType;
import com.prometheus.framework.web.controller.BaseController;
import com.prometheus.framework.web.domain.AjaxResult;
import com.prometheus.framework.web.page.TableDataInfo;
import com.prometheus.project.system.client.domain.Client;
import com.prometheus.project.system.client.service.IClientService;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 客户机构 信息操作处理
 *
 * @author chenzhi
 * @date 2019-03-29
 */
@Controller
@RequestMapping("/system/client")
public class ClientController extends BaseController {
    private String prefix = "system/client";

    private final IClientService clientService;

    public ClientController(IClientService clientService) {
        this.clientService = clientService;
    }

    @RequiresPermissions("system:client:view")
    @GetMapping()
    public String client() {
        return prefix + "/client";
    }

    /**
     * 查询客户机构列表
     */
    @RequiresPermissions("system:client:list")
    @PostMapping("/list")
    @ResponseBody
    public TableDataInfo list(Client client) {
        startPage();
        List<Client> list = clientService.selectClientList(client);
        return getDataTable(list);
    }


    /**
     * 导出客户机构列表
     */
    @RequiresPermissions("system:client:export")
    @PostMapping("/export")
    @ResponseBody
    public AjaxResult export(Client client) {
        List<Client> list = clientService.selectClientList(client);
        ExcelUtil<Client> util = new ExcelUtil<Client>(Client.class);
        return util.exportExcel(list, "client");
    }

    /**
     * 新增客户机构
     */
    @GetMapping("/add")
    public String add() {
        return prefix + "/add";
    }

    /**
     * 新增保存客户机构
     */
    @RequiresPermissions("system:client:add")
    @Log(title = "客户机构", businessType = BusinessType.INSERT)
    @PostMapping("/add")
    @ResponseBody
    public AjaxResult addSave(Client client) {
        return toAjax(clientService.insertClient(client));
    }

    /**
     * 修改客户机构
     */
    @GetMapping("/edit/{clientId}")
    public String edit(@PathVariable("clientId") Long clientId, ModelMap mmap) {
        Client client = clientService.selectClientById(clientId);
        mmap.put("client", client);
        return prefix + "/edit";
    }

    /**
     * 修改保存客户机构
     */
    @RequiresPermissions("system:client:edit")
    @Log(title = "客户机构", businessType = BusinessType.UPDATE)
    @PostMapping("/edit")
    @ResponseBody
    public AjaxResult editSave(Client client) {
        return toAjax(clientService.updateClient(client));
    }

    /**
     * 删除客户机构
     */
    @RequiresPermissions("system:client:remove")
    @Log(title = "客户机构", businessType = BusinessType.DELETE)
    @PostMapping("/remove")
    @ResponseBody
    public AjaxResult remove(String ids) {
        return toAjax(clientService.deleteClientByIds(ids));
    }

    /**
     * 客户机构状态修改
     */
    @Log(title = "用户管理", businessType = BusinessType.UPDATE)
    @RequiresPermissions("system:client:edit")
    @PostMapping("/changeStatus")
    @ResponseBody
    public AjaxResult changeStatus(Client client) {
        return toAjax(clientService.changeStatus(client));
    }

}
