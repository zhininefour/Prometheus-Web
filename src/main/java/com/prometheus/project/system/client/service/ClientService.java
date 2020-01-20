package com.prometheus.project.system.client.service;

import com.prometheus.project.system.client.domain.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * html调用 thymeleaf 实现字典读取
 *
 * @author chenzhi
 */
@Service("clientService")
public class ClientService {
    @Autowired
    private IClientService iClientService;


    /**
     * 查询 所有 客户机构
     *
     * @return 机构列表
     */
    public List<Client> selectClientList() {
        Client client = new Client();
        return iClientService.selectClientList(client);
    }


}
