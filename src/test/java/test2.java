/**
 * @description: TODO 测试转换json数据
 * @author: ChenZhi
 * @create: 2019/12/9 9:47
 * @version: 1.0
 **/


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.JSONArray;

import java.util.Map;

public class test2 {

    public static void main(String[] args) throws Exception {
        JSONObject createJSONObject = createJSONObject();
        System.out.println(createJSONObject);
    }

    // 创建JSONObject对象
    private static JSONObject createJSONObject() {
        JSONObject result = new JSONObject();
        result.put("success", true);
        result.put("totalCount", "30");

        JSONObject user1 = new JSONObject();
        user1.put("id", "12");
        user1.put("name", "张三");
        user1.put("createTime", "2017-11-16 12:12:12");

        JSONObject user2 = new JSONObject();
        user2.put("id", "13");
        user2.put("name", "李四");
        user2.put("createTime", "2017-11-16 12:12:15");

        JSONObject department = new JSONObject();
        department.put("id", 1);
        department.put("name","技术部");

        user1.put("department", department);
        user2.put("department", department);

        // 返回一个JSONArray对象
        JSONArray jsonArray = new JSONArray();
//        Map<String, String[]> params = request.getParameterMap();
//        params.put("1",user1);
//        params.put("1",user1);
        jsonArray.add(0, user1);
        jsonArray.add(1, user2);
        result.put("data", jsonArray);

//        Map<String, String[]> params = request.getParameterMap();
//        return JSON.toJSONString(params);
        return result;
    }
}
