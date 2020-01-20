package com.prometheus.project.common.dataValue.service;

import com.prometheus.common.utils.StringUtils;
import com.prometheus.common.utils.security.ShiroUtils;
import com.prometheus.project.common.dataValue.domain.DataValue;
import com.prometheus.project.common.dataValue.mapper.DataValueMapper;
import com.prometheus.project.system.user.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * id获取数据 服务层实现
 *
 * @author chenzhi
 * @date 2019-03-28
 */
@Service
public class DataValueServiceImpl implements IDataValueService {

    @Autowired
    private DataValueMapper dataValueMapper;

    /**
     * 根据机构id查询 表列表数据
     *
     * @param dataValue 表
     * @return 参数键值
     */
    @Override
    public List<DataValue> selectDataList(DataValue dataValue) {
        //不是超级管理员
        if (!User.isAdmin(ShiroUtils.getUserId())) {
            //不是机构表
            if(!("sys_client".equals(dataValue.getTableName()))){
                dataValue.setClientId(ShiroUtils.getSysUser().getClientId());
            }
        }
        return dataValueMapper.selectDataList(dataValue);
    }

}
