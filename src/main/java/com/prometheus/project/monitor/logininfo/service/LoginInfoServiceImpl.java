package com.prometheus.project.monitor.logininfo.service;

import java.util.List;

import com.prometheus.common.utils.security.ShiroUtils;
import com.prometheus.project.system.user.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.prometheus.common.utils.text.Convert;
import com.prometheus.project.monitor.logininfo.domain.LoginInfo;
import com.prometheus.project.monitor.logininfo.mapper.LoginInfoMapper;

/**
 * 系统访问日志情况信息 服务层处理
 *
 * @author chenzhi
 */
@Service
public class LoginInfoServiceImpl implements ILoginInfoService {
    @Autowired
    private LoginInfoMapper logininforMapper;

    /**
     * 新增系统登录日志
     *
     * @param logininfor 访问日志对象
     */
    @Override
    public void insertLoginInfo(LoginInfo logininfor) {
        if (!User.isAdmin(ShiroUtils.getUserId())) {
            logininfor.setClientId(ShiroUtils.getSysUser().getClientId());
        }
        logininforMapper.insertLoginInfo(logininfor);
    }

    /**
     * 查询系统登录日志集合
     *
     * @param logininfor 访问日志对象
     * @return 登录记录集合
     */
    @Override
    public List<LoginInfo> selectLoginInfoList(LoginInfo logininfor) {
        User user = ShiroUtils.getSysUser();
        if (!user.isAdmin()) {
            logininfor.setClientId(user.getClientId());
        }
        return logininforMapper.selectLoginInfoList(logininfor);
    }

    /**
     * 批量删除系统登录日志
     *
     * @param ids 需要删除的数据
     * @return
     */
    @Override
    public int deleteLoginInfoByIds(String ids) {
        return logininforMapper.deleteLoginInfoByIds(Convert.toStrArray(ids));
    }

    /**
     * 清空系统登录日志
     */
    @Override
    public void cleanLoginInfo() {
        User user = ShiroUtils.getSysUser();
        if (!user.isAdmin()) {
            logininforMapper.deleteLogininforByClientId(user.getClientId());
        }else {
            logininforMapper.cleanLoginInfo();
        }
    }
}
