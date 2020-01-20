package com.prometheus.common.utils;

import java.math.BigDecimal;
import java.time.LocalDate;


/**
 * @description: 根据经纬度获取日出日落时间
 * @author: ChenZhi
 * @create: 2019/4/9 0009 下午 05:25
 * @version: 1.0
 **/


public class SunRiseSetUtil {

    private static int[] days_of_month_1 = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
    private static int[] days_of_month_2 = {31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
    private final static double h = -0.833;//日出日落时太阳的位置
    private final static double UTo = 180.0;//上次计算的日落日出时间，初始迭代值180.0

    //输入日期

//输入经纬度


    /**
     * 功能描述: 判断是否为闰年：若为闰年，返回1；若不是闰年,返回0
     *
     * @param year
     * @return: boolean
     * @author: ChenZhi
     * @create: 2019/4/24 13:52
     * @version 1.0
     **/
    public static boolean leap_year(int year) {
        if (((year % 400 == 0) || (year % 100 != 0) && (year % 4 == 0))) return true;
        else return false;

    }

    /**
     * 功能描述: 求从格林威治时间公元2000年1月1日到计算日天数days
     *
     * @param year
     * @param month
     * @param date
     * @return: int
     * @author: ChenZhi
     * @create: 2019/4/24 13:52
     * @version 1.0
     **/
    public static int days(int year, int month, int date) {
        int i, a = 0;
        for (i = 2000; i < year; i++) {
            if (leap_year(i)) {
                a = a + 366;
            } else {
                a = a + 365;
            }
        }

        if (leap_year(year)) {
            for (i = 0; i < month - 1; i++) {
                a = a + days_of_month_2[i];
            }
        } else {
            for (i = 0; i < month - 1; i++) {
                a = a + days_of_month_1[i];
            }
        }
        a = a + date;
        return a;

    }

    /**
     * 功能描述: 求格林威治时间公元2000年1月1日到计算日的世纪数t
     *
     * @param days
     * @param UTo
     * @return: double
     * @author: ChenZhi
     * @create: 2019/4/24 13:52
     * @version 1.0
     **/
    public static double t_century(int days, double UTo) {
        return ((double) days + UTo / 360) / 36525;
    }

    /**
     * 功能描述: 求太阳的平黄径
     *
     * @param t_century
     * @return: double
     * @author: ChenZhi
     * @create: 2019/4/24 13:52
     * @version 1.0
     **/
    public static double L_sun(double t_century) {
        return (280.460 + 36000.770 * t_century);
    }

    /**
     * 功能描述: 求太阳的平近点角
     *
     * @param t_century
     * @return: double
     * @author: ChenZhi
     * @create: 2019/4/24 13:52
     * @version 1.0
     **/
    public static double G_sun(double t_century) {
        return (357.528 + 35999.050 * t_century);
    }

    /**
     * 功能描述: 求黄道经度
     *
     * @param L_sun
     * @param G_sun
     * @return: double
     * @author: ChenZhi
     * @create: 2019/4/24 13:52
     * @version 1.0
     **/
    public static double ecliptic_longitude(double L_sun, double G_sun) {
        return (L_sun + 1.915 * Math.sin(G_sun * Math.PI / 180) + 0.02 * Math.sin(2 * G_sun * Math.PI / 180));
    }

    /**
     * 功能描述: 求地球倾角
     *
     * @param t_century
     * @return: double
     * @author: ChenZhi
     * @create: 2019/4/24 13:53
     * @version 1.0
     **/
    public static double earth_tilt(double t_century) {
        return (23.4393 - 0.0130 * t_century);
    }

    /**
     * 功能描述: 求太阳偏差
     *
     * @param earth_tilt
     * @param ecliptic_longitude
     * @return: double
     * @author: ChenZhi
     * @create: 2019/4/24 13:53
     * @version 1.0
     **/
    public static double sun_deviation(double earth_tilt, double ecliptic_longitude) {
        return (180 / Math.PI * Math.asin(Math.sin(Math.PI / 180 * earth_tilt) * Math.sin(Math.PI / 180 * ecliptic_longitude)));
    }

    /**
     * 功能描述: 求格林威治时间的太阳时间角GHA
     *
     * @param UTo
     * @param G_sun
     * @param ecliptic_longitude
     * @return: double
     * @author: ChenZhi
     * @create: 2019/4/24 13:53
     * @version 1.0
     **/
    public static double GHA(double UTo, double G_sun, double ecliptic_longitude) {
        return (UTo - 180 - 1.915 * Math.sin(G_sun * Math.PI / 180) - 0.02 * Math.sin(2 * G_sun * Math.PI / 180) + 2.466 * Math.sin(2 * ecliptic_longitude * Math.PI / 180) - 0.053 * Math.sin(4 * ecliptic_longitude * Math.PI / 180));
    }

    /**
     * 功能描述: 求修正值e
     *
     * @param h
     * @param glat
     * @param sun_deviation
     * @return: double
     * @author: ChenZhi
     * @create: 2019/4/24 13:53
     * @version 1.0
     **/
    public static double e(double h, double glat, double sun_deviation) {
        return 180 / Math.PI * Math.acos((Math.sin(h * Math.PI / 180) - Math.sin(glat * Math.PI / 180) * Math.sin(sun_deviation * Math.PI / 180)) / (Math.cos(glat * Math.PI / 180) * Math.cos(sun_deviation * Math.PI / 180)));
    }

    /**
     * 功能描述: 求日出时间
     *
     * @param UTo
     * @param GHA
     * @param glong
     * @param e
     * @return: double
     * @author: ChenZhi
     * @create: 2019/4/24 13:53
     * @version 1.0
     **/
    public static double UT_rise(double UTo, double GHA, double glong, double e) {
        return (UTo - (GHA + glong + e));
    }

    /**
     * 功能描述: 求日落时间
     *
     * @param UTo
     * @param GHA
     * @param glong
     * @param e
     * @return: double
     * @author: ChenZhi
     * @create: 2019/4/24 13:53
     * @version 1.0
     **/
    public static double UT_set(double UTo, double GHA, double glong, double e) {
        return (UTo - (GHA + glong - e));
    }

    /**
     * 功能描述: 判断并返回结果（日出）
     *
     * @param UT
     * @param UTo
     * @param glong
     * @param glat
     * @param year
     * @param month
     * @param date
     * @return: double
     * @author: ChenZhi
     * @create: 2019/4/24 13:53
     * @version 1.0
     **/
    public static double result_rise(double UT, double UTo, double glong, double glat, int year, int month, int date) {
        double d;
        if (UT >= UTo) {
            d = UT - UTo;
        } else {
            d = UTo - UT;
        }
        if (d >= 0.1) {
            UTo = UT;
//            double GHA = getGHA(year, month, date);
//            double e = getE(year, month, date, glong, glat);
//            UT = UT_rise(UTo, GHA, glong,e);
//            result_rise(UT, UTo, glong, glat, year, month, date);
            UT = UT_rise(UTo,
                    GHA(UTo, G_sun(t_century(days(year, month, date), UTo)),
                            ecliptic_longitude(L_sun(t_century(days(year, month, date), UTo)),
                                    G_sun(t_century(days(year, month, date), UTo)))),
                    glong,
                    e(h, glat, sun_deviation(earth_tilt(t_century(days(year, month, date), UTo)),
                            ecliptic_longitude(L_sun(t_century(days(year, month, date), UTo)),
                                    G_sun(t_century(days(year, month, date), UTo))))));
            result_rise(UT, UTo, glong, glat, year, month, date);
        }
        return UT;
    }

    /**
     * 功能描述: 判断并返回结果（日落）
     *
     * @param UT
     * @param UTo
     * @param glong
     * @param glat
     * @param year
     * @param month
     * @param date
     * @return: double
     * @author: ChenZhi
     * @create: 2019/4/24 13:54
     * @version 1.0
     **/
    public static double result_set(double UT, double UTo, double glong, double glat, int year, int month, int date) {
        double d;
        if (UT >= UTo) {
            d = UT - UTo;
        } else {
            d = UTo - UT;
        }
        if (d >= 0.1) {
            UTo = UT;
//            double GHA = getGHA(year, month, date);
//            double e = getE(year, month, date, glong, glat);
//            UT = UT_set(UTo, GHA, glong,e);
//            result_set(UT, UTo, glong, glat, year, month, date);
            UT = UT_set(UTo,
                    GHA(UTo, G_sun(t_century(days(year, month, date), UTo)),
                            ecliptic_longitude(L_sun(t_century(days(year, month, date), UTo)),
                                    G_sun(t_century(days(year, month, date), UTo)))),
                    glong,
                    e(h, glat, sun_deviation(earth_tilt(t_century(days(year, month, date), UTo)),
                            ecliptic_longitude(L_sun(t_century(days(year, month, date), UTo)),
                                    G_sun(t_century(days(year, month, date), UTo))))));
            result_set(UT, UTo, glong, glat, year, month, date);
        }
        return UT;

    }

    /**
     * 功能描述: 求时区
     *
     * @param glong
     * @return: int
     * @author: ChenZhi
     * @create: 2019/4/24 13:54
     * @version 1.0
     **/
    public static int Zone(double glong) {
        if (glong >= 0) {
            return ((int) (glong / 15.0) + 1);
        } else {
            return ((int) (glong / 15.0) - 1);
        }
    }

    /**
     * 功能描述: 获取日出时间
     *
     * @param longitude
     * @param latitude
     * @param sunTime
     * @return: java.lang.String
     * @author: ChenZhi
     * @create: 2019/4/24 13:55
     * @version 1.0
     **/
    public static String getSunrise(BigDecimal longitude, BigDecimal latitude, LocalDate sunTime) {
        String type = "RISE";
        return getSunRiseset(longitude, latitude, sunTime, type);
    }


    /**
     * 功能描述: 获取日落时间
     *
     * @param longitude
     * @param latitude
     * @param sunTime
     * @return: java.lang.String
     * @author: ChenZhi
     * @create: 2019/4/24 13:55
     * @version 1.0
     **/
    public static String getSunset(BigDecimal longitude, BigDecimal latitude, LocalDate sunTime) {
        String type = "SET";
        return getSunRiseset(longitude, latitude, sunTime, type);
    }

    /**
     * 功能描述: 获取日出日落时间
     *
     * @param longitude
     * @param latitude
     * @param sunTime
     * @param type
     * @return: java.lang.String
     * @author: ChenZhi
     * @create: 2019/4/24 15:02
     * @version 1.0
     **/
    public static String getSunRiseset(BigDecimal longitude, BigDecimal latitude, LocalDate sunTime, String type) {
        if (sunTime != null && latitude != null && longitude != null) {
            double glong, glat;
            int year = sunTime.getYear();
            int month = sunTime.getMonthValue();
            int date = sunTime.getDayOfMonth();
            glong = longitude.doubleValue();
            glat = latitude.doubleValue();

            double GHA = getGHA(year, month, date);
            double e = getE(year, month, date, glong, glat);

            if ("RISE".equals(type)) {
                double UT = UT_rise(UTo, GHA, glong, e);
                double sunrise = result_rise(UT, UTo, glong, glat, year, month, date);
                return (int) (sunrise / 15 + 8) + ":" + (int) (60 * (sunrise / 15 + 8 - (int) (sunrise / 15 + 8)));
            } else if ("SET".equals(type)) {
                double UT = UT_set(UTo, GHA, glong, e);
                double sunset = result_set(UT, UTo, glong, glat, year, month, date);

                return (int) (sunset / 15 + 8) + ":" + (int) (60 * (sunset / 15 + 8 - (int) (sunset / 15 + 8)));
            } else {
                return null;
            }

//            if("RISE".equals(type)){
//                double sunrise = result_rise(
//                        UT_rise(UTo,
//                                GHA(UTo,
//                                        G_sun(t_century(days(year, month, date), UTo)),
//                                        ecliptic_longitude(L_sun(t_century(days(year, month, date), UTo)),
//                                                G_sun(t_century(days(year, month, date), UTo)))),glong,
//                                e(h, glat, sun_deviation(earth_tilt(t_century(days(year, month, date), UTo)),
//                                        ecliptic_longitude(L_sun(t_century(days(year, month, date), UTo)),
//                                                G_sun(t_century(days(year, month, date), UTo)))))), UTo, glong, glat, year, month, date);
//                return (int) (sunrise / 15 + 8) + ":" + (int) (60 * (sunrise / 15 + 8 - (int) (sunrise / 15 + 8)));
//
//            }else if("SET".equals(type)){
//               double sunset = result_set(UT_set(UTo,
//                        GHA(UTo, G_sun(t_century(days(year, month, date), UTo)),
//                                ecliptic_longitude(L_sun(t_century(days(year, month, date), UTo)),
//                                        G_sun(t_century(days(year, month, date), UTo)))),
//                        glong,
//                        e(h, glat, sun_deviation(earth_tilt(t_century(days(year, month, date), UTo)),
//                                ecliptic_longitude(L_sun(t_century(days(year, month, date), UTo)),
//                                        G_sun(t_century(days(year, month, date), UTo)))))), UTo, glong, glat, year, month, date);
//                return (int) (sunset / 15 + 8) + ":" + (int) (60 * (sunset / 15 + 8 - (int) (sunset / 15 + 8)));
//            }else{
//                return null;
//            }
        }
        return null;
    }

    /**
     * 功能描述: 返回 gha
     *
     * @param year
     * @param month
     * @param date
     * @return: double
     * @author: ChenZhi
     * @create: 2019/4/24 14:55
     * @version 1.0
     **/
    public static double getGHA(int year, int month, int date) {
        double GHA = GHA(UTo, G_sun(t_century(days(year, month, date), UTo)), ecliptic_longitude(L_sun(t_century(days(year, month, date), UTo)), G_sun(t_century(days(year, month, date), UTo))));
        return GHA;
    }

    /**
     * 功能描述: 返回e
     *
     * @param year
     * @param month
     * @param date
     * @param glong
     * @param glat
     * @return: double
     * @author: ChenZhi
     * @create: 2019/4/24 14:55
     * @version 1.0
     **/
    public static double getE(int year, int month, int date, double glong, double glat) {
        double e = e(h, glat, sun_deviation(earth_tilt(t_century(days(year, month, date), UTo)), ecliptic_longitude(L_sun(t_century(days(year, month, date), UTo)), G_sun(t_century(days(year, month, date), UTo)))));
        return e;
    }

    /**
     * 功能描述: main主方法
     *
     * @param args
     * @return: void
     * @author: ChenZhi
     * @create: 2019/4/24 13:55
     * @version 1.0
     **/
    public static void main(String[] args) {
        String str1 = SunRiseSetUtil.getSunrise(new BigDecimal(112.929358), new BigDecimal(28.248792), LocalDate.of(2019, 12, 31));
        String str2 = SunRiseSetUtil.getSunset(new BigDecimal(112.929358), new BigDecimal(28.248792), LocalDate.of(2019, 12, 31));
        System.out.println("日出时间：" + str1);
        System.out.println("日落时间：" + str2);
    }
}