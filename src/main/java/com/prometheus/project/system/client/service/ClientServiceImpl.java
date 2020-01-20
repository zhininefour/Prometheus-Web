package com.prometheus.project.system.client.service;

import com.prometheus.common.utils.StringUtils;
import com.prometheus.common.utils.security.ShiroUtils;
import com.prometheus.common.utils.text.Convert;
import com.prometheus.project.system.client.domain.Client;
import com.prometheus.project.system.client.mapper.ClientMapper;
import com.prometheus.project.system.user.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 客户机构 服务层实现
 *
 * @author chenzhi
 * @date 2019-03-29
 */
@Service
public class ClientServiceImpl implements IClientService {
    @Autowired
    private ClientMapper clientMapper;
//    @Autowired
//    private AreafileMapper areafileMapper;

//    @Autowired
//    private ISysparmService sysparmService;

    /**
     * 查询客户机构信息
     *
     * @param clientId 客户机构ID
     * @return 客户机构信息
     */
    @Override
    public Client selectClientById(Long clientId) {
        return clientMapper.selectClientById(clientId);
    }

    /**
     * 查询客户机构列表
     *
     * @param client 客户机构信息
     * @return 客户机构集合
     */
    @Override
    public List<Client> selectClientList(Client client) {
        // 生成数据权限过滤条件
        if (!(User.isAdmin(ShiroUtils.getUserId()))) {
            client.setClientId(ShiroUtils.getSysUser().getClientId());
        }
        return clientMapper.selectClientList(client);
    }

    /**
     * 新增客户机构
     *
     * @param client 客户机构信息
     * @return 结果
     */
    @Override
    @Transactional
    public int insertClient(Client client) {
        client.setCreateBy(ShiroUtils.getLoginName());
        int count = clientMapper.insertClient(client);
//        int clientID = client.getClientId().intValue();
            //新增areafile一条初始记录
//            insertAreaFile(clientID);
        return count;
    }
    /**
     * 新增区域信息表
     * @param
     */
//    public void insertAreaFile(int clientID) {
//        Areafile areafile = new Areafile();
//        areafile.setClientID(Long.valueOf(clientID));
//        areafile.setAreaID(100L);
//        areafile.setAreaName("全部区域");
//        areafile.setParentAreaID(0L);
//        areafile.setAncestors("0");
//        areafileMapper.insertAreafileDefault(areafile);
//    }
    /**
     * 新增系统参数表
     *
     * @param clientID
     */

    /**
     * 修改客户机构
     *
     * @param client 客户机构信息
     * @return 结果
     */
    @Override
    public int updateClient(Client client) {
        client.setUpdateBy(ShiroUtils.getLoginName());
        return clientMapper.updateClient(client);
    }

    /**
     * 删除客户机构对象
     *
     * @param ids 需要删除的数据ID
     * @return 结果
     */
    @Override
    public int deleteClientByIds(String ids) {
        return clientMapper.deleteClientByIds(Convert.toStrArray(ids));
    }

    /**
     * 机构状态修改
     *
     * @param  client 用户信息
     * @return 结果
     */
    @Override
    public int changeStatus(Client client) {
        return clientMapper.updateClient(client);
    }

}
