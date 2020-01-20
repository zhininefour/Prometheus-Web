package com.prometheus.project.monitor.logininfo.mapper;

import java.util.List;
import com.prometheus.project.monitor.logininfo.domain.LoginInfo;

/**
 * 系统访问日志情况信息 数据层
 * 
 * @author chenzhi
 */
public interface LoginInfoMapper
{
    /**
     * 新增系统登录日志
     * 
     * @param logininfor 访问日志对象
     */
    public void insertLoginInfo(LoginInfo logininfor);

    /**
     * 查询系统登录日志集合
     * 
     * @param logininfor 访问日志对象
     * @return 登录记录集合
     */
    public List<LoginInfo> selectLoginInfoList(LoginInfo logininfor);

    /**
     * 批量删除系统登录日志
     * 
     * @param ids 需要删除的数据
     * @return 结果
     */
    public int deleteLoginInfoByIds(String[] ids);

    /**
     * 批量删除系统登录日志
     *
     * @param clientId 需要删除的数据的机构id
     * @return 结果
     */
    public void deleteLogininforByClientId(Long clientId);

    /**
     * 清空系统登录日志
     * 
     * @return 结果
     */
    public int cleanLoginInfo();
}
