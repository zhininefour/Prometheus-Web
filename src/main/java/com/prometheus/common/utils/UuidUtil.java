package com.prometheus.common.utils;

/**
 * @description: 获取 uuid 工具类
 * @author: ChenZhi
 * @create: 2019/3/29 0029 上午 09:41
 * @version: 1.0
 **/

public class UuidUtil {
    //20位末尾的数字id
    public static volatile int Guid = 100;

    public static String getGuid() {
        //用于后三位自增
        Guid += 1;
        long now = System.currentTimeMillis();
        //获取4位年份数字
//        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy");
        //获取时间戳
        String info1 = now + "";
        String info = String.valueOf(now);
        //获取三位随机数
        //int ran=(int) ((Math.random()*9+1)*100);
        //要是一段时间内的数据连过大会有重复的情况，所以做以下修改,从100开始自增长，到999后，重新从100开始
        int ran;
        if (Guid > 999) {
            Guid = 100;
        }
        ran = Guid;
//        System.out.println(info1.substring(2, info.length()));
        return info + ran;//1554251983099101
//        return time + info + ran;//20191554251983099101
    }

    public static void main(String[] args) {
        //调用生成id方法
        System.out.println(getGuid());
    }


    /**
     * 功能描述: 获取一段值中缺少的值
     *
     * @param array 查询出来是从小到大排序好的数组
     * @return: int
     * @author: ChenZhi
     * @create: 2019/6/26 9:14
     * @version 1.0
     **/
    public static int getLoseNum(int[] array) {
        int length = array.length;
        int returnInt = 0, maxNum = 0;
        if (length > 0) {
            maxNum = array[length - 1];//原始数组里的最大值
            int[] tempArray = new int[maxNum];// {maxNum};//从1到最大值的数组
            for (int i = 0; i < maxNum; i++) {
                tempArray[i] = i + 1;
            }
            for (int i = 0; i < tempArray.length; i++) {
                if (!binarySearch(array, tempArray[i])) {
                    // 采用二分查找法判断数组a中的元素是否出于在数组b中
                    returnInt = tempArray[i];
                    break;
                }
            }
        }
        if (returnInt == 0) {
            //如果为0，证明取出的测量点号没有断层，取最大值加1
            returnInt = maxNum + 1;
        }
        if (returnInt > 2040) {
            // TODO 不能超过2040
        }
        return returnInt;
    }


    /**
     * 二分查找法
     *
     * @param arr 数组
     * @param num 数值
     * @return 找到则返回true, 否则返回false
     */
    private static boolean binarySearch(int[] arr, int num) {
        int low = 0;
        int high = arr.length - 1;
        while (low <= high) {
            int middle = (low + high) / 2;
            if (arr[middle] == num) {
                return true;
            } else if (arr[middle] > num) {
                high = middle - 1;
            } else
                low = middle + 1;
        }
        return false;
    }

    /**
     * 获取数字型主键
     *
     * @return
     */
    public static Long getLongKey() {
        long timeMillis = System.currentTimeMillis();
        int random = Double.valueOf(Math.random() * 1000).intValue();
        String string = timeMillis + String.valueOf(random);
        return Long.valueOf(string);
    }
}
