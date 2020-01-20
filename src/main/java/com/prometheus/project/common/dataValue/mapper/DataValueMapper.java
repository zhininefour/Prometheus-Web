package com.prometheus.project.common.dataValue.mapper;


import com.prometheus.project.common.dataValue.domain.DataValue;

import java.util.List;

/**
 *    数据层
 *
 * @author chenzhi
 * @date 2019-04-15
 */
public interface DataValueMapper{


    /**
     * 查询 列表
     *
     * @param dataValue
     * @return  集合
     */
    public List<DataValue> selectDataList(DataValue dataValue);

}