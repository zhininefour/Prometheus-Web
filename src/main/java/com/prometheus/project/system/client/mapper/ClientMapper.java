package com.prometheus.project.system.client.mapper;

import com.prometheus.project.system.client.domain.Client;

import java.util.List;

/**
 * 客户机构 数据层
 *
 * @author chenzhi
 * @date 2019-03-29
 */
public interface ClientMapper {
    /**
     * 查询客户机构信息
     *
     * @param clientId 客户机构ID
     * @return 客户机构信息
     */
    public Client selectClientById(Long clientId);

    /**
     * 查询客户机构列表
     *
     * @param client 客户机构信息
     * @return 客户机构集合
     */
    public List<Client> selectClientList(Client client);

    /**
     * 新增客户机构
     *
     * @param client 客户机构信息
     * @return 结果
     */
    public int insertClient(Client client);

    /**
     * 修改客户机构
     *
     * @param client 客户机构信息
     * @return 结果
     */
    public int updateClient(Client client);

    /**
     * 删除客户机构
     *
     * @param clientid 客户机构ID
     * @return 结果
     */
    public int deleteClientById(Integer clientid);

    /**
     * 批量删除客户机构
     *
     * @param clientIds 需要删除的数据ID
     * @return 结果
     */
    public int deleteClientByIds(String[] clientIds);
}