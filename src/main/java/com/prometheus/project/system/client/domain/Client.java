package com.prometheus.project.system.client.domain;


import com.prometheus.framework.web.domain.BaseEntity;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 客户机构表 sys_client
 *
 * @author chenzhi
 * @date 2019-03-29
 */
@Data
public class Client extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /**
     * 客户机构id
     */
    private Long clientId;
    /**
     * 机构名称
     */
    private String clientName;
    /**
     * 显示顺序
     */
    private Integer orderNum;
    /**
     * 负责人
     */
    private String leader;
    /**
     * 联系电话
     */
    private String phone;
    /**
     * 邮箱
     */
    private String email;
    /**
     * 纬度
     */
    private BigDecimal latitude;
    /**
     * 经度
     */
    private BigDecimal longitude;
    /**
     * 有效期开始时间
     */
    private String validStartTime;
    /**
     * 有效期结束时间
     */
    private String validEndTime;
    /**
     * 机构状态（0正常 1停用）
     */
    private String status;
    /**
     * 删除标志（0代表存在 2代表删除）
     */
    private String delFlag;
    /**
     * 创建者
     */
    private String createBy;
    /**
     * 创建时间
     */
    private Date createTime;
    /**
     * 更新者
     */
    private String updateBy;
    /**
     * 更新时间
     */
    private Date updateTime;
}
