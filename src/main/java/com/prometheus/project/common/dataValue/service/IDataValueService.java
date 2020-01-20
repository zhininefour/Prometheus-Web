package com.prometheus.project.common.dataValue.service;


import com.prometheus.project.common.dataValue.domain.DataValue;

import java.util.List;

/**
 * 区域档案 服务层
 *
 * @author chenzhi
 * @date 2019-03-28
 */
public interface IDataValueService {
    /**
     * 根据机构id查询 表列表数据
     *
     * @param dataValue
     * @return 参数键值
     */
    public List<DataValue> selectDataList(DataValue dataValue);
}
