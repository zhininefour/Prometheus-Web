package com.prometheus.project.common.dataValue.service;

import com.prometheus.project.common.dataValue.domain.DataValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @description: 查询表数据 编码 名称
 * @author: ChenZhi
 * @create: 2019/4/15 11:16
 * @version: 1.0
 **/
@Service("dataValue")
public class DataValueService {
    @Autowired
    private IDataValueService dataValueService;

    /**
     * 根据机构id查询 表列表数据
     *
     * @param tableName 表名称
     * @return 参数键值
     */
    public List<DataValue> selectDataList(String tableName) {
        DataValue dataValue = new DataValue();
        dataValue.setTableName(tableName);
        return dataValueService.selectDataList(dataValue);
    }

}
