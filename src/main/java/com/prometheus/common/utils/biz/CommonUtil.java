package com.prometheus.common.utils.biz;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.DateUtil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @description: 业务相关 工具类
 * @author: ChenZhi
 * @create: 2019/11/29 0029 上午 09:41
 * @version: 1.0
 **/

public class CommonUtil {

    /**
     * 功能描述: 根据楼层数量和房间数量 自动生成房间号码
     *
     * @param buildNo  楼栋编号
     * @param layerNum 楼层数量
     * @param houseNum 每层房间数量
     * @return: java.util.List<java.lang.String>
     * @author: ChenZhi
     * @create: 2019/11/29 15:03
     * @version 1.0
     **/
    public static Map<String, List<String>> getHouseNo(String buildNo, String layerNum, String houseNum) {
        List<String> list = new ArrayList<>();
        Map<String, List<String>> map = new HashMap();
        int layer_num = 0, house_num = 0;
        if (StringUtils.isNotBlank(layerNum) && StringUtils.isNotBlank(houseNum)) {
            layer_num = Integer.parseInt(layerNum);
            house_num = Integer.parseInt(houseNum);
            //循环生成楼层
            String houseNo = "";
            for (int layer = 1; layer <= layer_num; layer++) {
                //循环生成房间号
                list = new ArrayList<>();
                for (int room = 1; room <= house_num; room++) {
                    if(room < 10){
                        houseNo = layer + "0" + room;
                    }else{
                        houseNo = layer + "" + room;
                    }
                    list.add(buildNo + "-" + houseNo);
                }
                map.put(String.valueOf(layer),list);
            }
        }
        return map;
    }

    public static void main(String[] args) {
        System.out.println( getHouseNo("C2" , "10","4"));
//        List<String> list = new ArrayList<>();
//        for (String houseNo : list) {
//            System.out.println(houseNo);
//        }
    }
}
