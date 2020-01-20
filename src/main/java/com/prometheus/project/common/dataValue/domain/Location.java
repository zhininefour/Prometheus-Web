package com.prometheus.project.common.dataValue.domain;


import com.prometheus.framework.web.domain.BaseEntity;
import lombok.Data;

import java.math.BigDecimal;

/**
 * Location
 *
 * @author chenzhi
 * @date 2019-04-15
 */
@Data
public class Location extends BaseEntity {
    private static final long serialVersionUID = 1L;
    /**
     * 客户编码
     */
//    private Long clientID;
    /**
     * 线路编码
     */
    private BigDecimal lineID;
    private String lineAreaID;


    private String getLocationType;
    private String parentId;
    /**
     * 终端编码
     */
    private BigDecimal termID;
    /**
     * 纬度
     */
    private String latitude;
    /**
     * 经度
     */
    private String longitude;
}
