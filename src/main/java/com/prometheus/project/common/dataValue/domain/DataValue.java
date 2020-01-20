package com.prometheus.project.common.dataValue.domain;


import com.prometheus.framework.web.domain.BaseEntity;
import lombok.Data;

/**
 * datavalue
 *
 * @author chenzhi
 * @date 2019-04-15
 */
@Data
public class DataValue extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /**
     * 编码
     */
    private String dataId;
    /**
     * 名称
     */
    private String dataName;
    /**
     * 客户编码
     */
    private Long clientId;
    /**
     * 客户编码
     */
    private String tableName;

}
