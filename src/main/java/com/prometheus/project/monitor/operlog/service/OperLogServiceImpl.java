package com.prometheus.project.monitor.operlog.service;

import java.util.List;

import com.prometheus.common.utils.StringUtils;
import com.prometheus.common.utils.security.ShiroUtils;
import com.prometheus.project.system.user.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.prometheus.common.utils.text.Convert;
import com.prometheus.project.monitor.operlog.domain.OperLog;
import com.prometheus.project.monitor.operlog.mapper.OperLogMapper;

/**
 * 操作日志 服务层处理
 *
 * @author chenzhi
 */
@Service
public class OperLogServiceImpl implements IOperLogService {
    @Autowired
    private OperLogMapper operLogMapper;

    /**
     * 新增操作日志
     *
     * @param operLog 操作日志对象
     */
    @Override
    public void insertOperLog(OperLog operLog) {
        if (!User.isAdmin(ShiroUtils.getUserId())) {
            operLog.setClientId(ShiroUtils.getSysUser().getClientId());
        }
        operLogMapper.insertOperLog(operLog);
    }

    /**
     * 查询系统操作日志集合
     *
     * @param operLog 操作日志对象
     * @return 操作日志集合
     */
    @Override
    public List<OperLog> selectOperLogList(OperLog operLog) {
        User user = ShiroUtils.getSysUser();
        if (!user.isAdmin()) {
            operLog.setClientId(user.getClientId());
        }
            return operLogMapper.selectOperLogList(operLog);
    }

    /**
     * 批量删除系统操作日志
     *
     * @param ids 需要删除的数据
     * @return
     */
    @Override
    public int deleteOperLogByIds(String ids) {
        return operLogMapper.deleteOperLogByIds(Convert.toStrArray(ids));
    }

    /**
     * 查询操作日志详细
     *
     * @param operId 操作ID
     * @return 操作日志对象
     */
    @Override
    public OperLog selectOperLogById(Long operId) {
        return operLogMapper.selectOperLogById(operId);
    }

    /**
     * 清空操作日志
     */
    @Override
    public void cleanOperLog() {
        User user = ShiroUtils.getSysUser();
        if (!user.isAdmin()) {
            operLogMapper.deleteOperLogByClientId(user.getClientId());
        }else {
            operLogMapper.cleanOperLog();
        }
    }

}
