package com.prometheus.framework.config;

import at.pollux.thymeleaf.shiro.dialect.ShiroDialect;
import com.google.common.collect.Sets;
import com.prometheus.common.utils.StringUtils;
import com.prometheus.common.utils.spring.SpringUtils;
import com.prometheus.framework.shiro.realm.AppRealm;
import com.prometheus.framework.shiro.realm.WebRealm;
import com.prometheus.framework.shiro.session.OnlineSessionDAO;
import com.prometheus.framework.shiro.session.OnlineSessionFactory;
import com.prometheus.framework.shiro.web.filter.LogoutFilter;
import com.prometheus.framework.shiro.web.filter.captcha.CaptchaValidateFilter;
import com.prometheus.framework.shiro.web.filter.kickout.KickoutSessionFilter;
import com.prometheus.framework.shiro.web.filter.online.OnlineSessionFilter;
import com.prometheus.framework.shiro.web.filter.sync.SyncOnlineSessionFilter;
import com.prometheus.framework.shiro.web.session.OnlineWebSessionManager;
import com.prometheus.framework.shiro.web.session.SpringSessionValidationScheduler;
import net.sf.ehcache.CacheManager;
import org.apache.commons.io.IOUtils;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.codec.Base64;
import org.apache.shiro.config.ConfigurationException;
import org.apache.shiro.io.ResourceUtils;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.realm.Realm;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.CookieRememberMeManager;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.apache.shiro.web.servlet.SimpleCookie;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.servlet.Filter;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * @description: shiro配置类
 * @author: ChenZhi
 * @create: 2019/5/13 9:50
 * @version: 1.0
 **/
@Configuration
public class ShiroConfig {
    public static final String PREMISSION_STRING = "perms[\"{0}\"]";

    // Session超时时间，单位为毫秒（默认30分钟）
    @Value("${shiro.session.expireTime}")
    private int expireTime;

    // 相隔多久检查一次session的有效性，单位毫秒，默认就是10分钟
    @Value("${shiro.session.validationInterval}")
    private int validationInterval;

    // 同一个用户最大会话数
    @Value("${shiro.session.maxSession}")
    private int maxSession;

    // 踢出之前登录的/之后登录的用户，默认踢出之前登录的用户
    @Value("${shiro.session.kickoutAfter}")
    private boolean kickoutAfter;

    // 验证码开关
    @Value("${shiro.user.captchaEnabled}")
    private boolean captchaEnabled;

    // 验证码类型
    @Value("${shiro.user.captchaType}")
    private String captchaType;

    // 设置Cookie的域名
    @Value("${shiro.cookie.domain}")
    private String domain;

    // 设置cookie的有效访问路径
    @Value("${shiro.cookie.path}")
    private String path;

    // 设置HttpOnly属性
    @Value("${shiro.cookie.httpOnly}")
    private boolean httpOnly;

    // 设置Cookie的过期时间，秒为单位
    @Value("${shiro.cookie.maxAge}")
    private int maxAge;

    // 登录地址
    @Value("${shiro.user.loginUrl}")
    private String loginUrl;

    // 权限认证失败地址
    @Value("${shiro.user.unauthorizedUrl}")
    private String unauthorizedUrl;

    /**
     * 缓存管理器 使用Ehcache实现
     */
    @Bean
    public EhCacheManager getEhCacheManager() {
        CacheManager cacheManager = CacheManager.getCacheManager("prometheus");
        EhCacheManager em = new EhCacheManager();
        if (StringUtils.isNull(cacheManager)) {
            em.setCacheManager(new CacheManager(getCacheManagerConfigFileInputStream()));
            return em;
        } else {
            em.setCacheManager(cacheManager);
            return em;
        }
    }

    /**
     * 返回配置文件流 避免ehcache配置文件一直被占用，无法完全销毁项目重新部署
     */
    protected InputStream getCacheManagerConfigFileInputStream() {
        String configFile = "classpath:ehcache/ehcache-shiro.xml";
        InputStream inputStream = null;
        try {
            inputStream = ResourceUtils.getInputStreamForPath(configFile);
            byte[] b = IOUtils.toByteArray(inputStream);
            InputStream in = new ByteArrayInputStream(b);
            return in;
        } catch (IOException e) {
            throw new ConfigurationException(
                    "Unable to obtain input stream for cacheManagerConfigFile [" + configFile + "]", e);
        } finally {
            IOUtils.closeQuietly(inputStream);
        }
    }

    /**
     * 自定义的Realm 将参数HashedCredentialsMatcher修改成重写后的类
     */
//    @Bean()
//    public ShiroRealm myShiroCasRealm(MyRetryLimitCredentialsMatcher matcher) {
//        ShiroRealm realm = new ShiroRealm();
//        realm.setCredentialsMatcher(matcher);
//        return realm;
//    }
//

    /**
     * 自定义sessionDAO会话
     */
    @Bean
    public OnlineSessionDAO sessionDAO() {
        return new OnlineSessionDAO();
    }

    /**
     * 自定义sessionFactory会话
     */
    @Bean
    public OnlineSessionFactory sessionFactory() {
        return new OnlineSessionFactory();
    }


    @Bean
    public OnlineWebSessionManager sessionValidationManager() {
        OnlineWebSessionManager manager = new OnlineWebSessionManager();
        // 加入缓存管理器
        manager.setCacheManager(getEhCacheManager());
        // 删除过期的session
        manager.setDeleteInvalidSessions(true);
        // 设置全局session超时时间
        manager.setGlobalSessionTimeout(expireTime * 60 * 1000);
        // 去掉 JSESSIONID
        manager.setSessionIdUrlRewritingEnabled(false);
        // 是否定时检查session
        manager.setSessionValidationSchedulerEnabled(true);
        // 自定义SessionDao
        manager.setSessionDAO(sessionDAO());
        // 自定义sessionFactory
        manager.setSessionFactory(sessionFactory());
        return manager;
    }

    /**
     * 会话管理器
     */
    @Bean
    public OnlineWebSessionManager sessionManager() {
        OnlineWebSessionManager manager = new OnlineWebSessionManager();
        // 加入缓存管理器
        manager.setCacheManager(getEhCacheManager());
        // 删除过期的session
        manager.setDeleteInvalidSessions(true);
        // 设置全局session超时时间
        manager.setGlobalSessionTimeout(expireTime * 60 * 1000);
        // 去掉 JSESSIONID
        manager.setSessionIdUrlRewritingEnabled(false);
        // 定义要使用的无效的Session定时调度器
        manager.setSessionValidationScheduler(SpringUtils.getBean(SpringSessionValidationScheduler.class));
        // 是否定时检查session
        manager.setSessionValidationSchedulerEnabled(true);
        // 自定义SessionDao
        manager.setSessionDAO(sessionDAO());
        // 自定义sessionFactory
        manager.setSessionFactory(sessionFactory());
        return manager;
    }



    /**
     * 自定义sessionFactory调度器
     */
//    @Bean
//    public SpringSessionValidationScheduler sessionValidationScheduler() {
//        SpringSessionValidationScheduler sessionValidationScheduler = new SpringSessionValidationScheduler();
//        // 相隔多久检查一次session的有效性，单位毫秒，默认就是10分钟
//        sessionValidationScheduler.setSessionValidationInterval(validationInterval * 60 * 1000);
//        // 设置会话验证调度器进行会话验证时的会话管理器
//        sessionValidationScheduler.setSessionManager(sessionValidationManager());
//        return sessionValidationScheduler;
//    }

    /**************************************************************************************************************/


    /**
     * 安全管理器
     */
    @Bean
    public SecurityManager securityManager() {
        DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
        //设置realm.
//        securityManager.setRealm(webRealm(getEhCacheManager()));
//        securityManager.setRealm(myShiroCasRealm(matcher));
        Collection<Realm> collection = Sets.newHashSet();
        collection.add(webRealm(getEhCacheManager()));
        collection.add(appRealm(getEhCacheManager()));
        securityManager.setRealms(collection);

        //  用户授权/认证信息Cache, 采用EhCache 缓存 // 注入缓存管理器;
        securityManager.setCacheManager(getEhCacheManager());
        // 记住我
        securityManager.setRememberMeManager(rememberMeManager());
        // session管理器
        securityManager.setSessionManager(sessionManager());
        return securityManager;
    }

    /**
     * 自定义网页端 Realm 让spring管理的realm Bean
     */
    @Bean
//    public WebRealm webRealm(@Qualifier("myRetryLimitCredentialsMatcher") MyRetryLimitCredentialsMatcher matcher) {
    public WebRealm webRealm(EhCacheManager cacheManager) {
//    public WebRealm webRealm(EhCacheManager cacheManager, @Qualifier("myRetryLimitCredentialsMatcher") MyRetryLimitCredentialsMatcher matcher) {
        WebRealm webRealm = new WebRealm();
        webRealm.setCacheManager(cacheManager);
//        webRealm.setCredentialsMatcher(matcher);
        return webRealm;
    }
    @Bean
//    public WebRealm webRealm(@Qualifier("myRetryLimitCredentialsMatcher") MyRetryLimitCredentialsMatcher matcher) {
    public AppRealm appRealm(EhCacheManager cacheManager) {
        AppRealm appRealm = new AppRealm();
        appRealm.setCacheManager(cacheManager);
        return appRealm;
    }
    /**
     * 如果有多个realm，会使用这个来选择策略，进行调度，判断realm的权限校验是否通过
     *
     * @return
     */
//    @Bean
//    public ModularRealmAuthenticator modularRealmAuthenticator() {
//        ModularRealmAuthenticator modularRealmAuthenticator = new ModularRealmAuthenticator();
//        // 只要有一个realm成功，就放行，并且不继续判断realm
//        modularRealmAuthenticator.setAuthenticationStrategy(new FirstSuccessfulStrategy());
//        return modularRealmAuthenticator;
//    }

    /**
     * 密码匹配凭证管理器
     *
     * @return
     */
//    @Bean(name = "myCredentialsMatcher")
//    public MyRetryLimitCredentialsMatcher hashedCredentialsMatcher() {
//        MyRetryLimitCredentialsMatcher hashedCredentialsMatcher = new MyRetryLimitCredentialsMatcher();
//        return hashedCredentialsMatcher;
//    }


    /**
     * Shiro过滤器配置
     */
    @Bean
    public ShiroFilterFactoryBean shiroFilterFactoryBean(SecurityManager securityManager) {
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
        // Shiro的核心安全接口,这个属性是必须的
        shiroFilterFactoryBean.setSecurityManager(securityManager);
        // 身份认证失败，则跳转到登录页面的配置
        shiroFilterFactoryBean.setLoginUrl(loginUrl);
        // 权限认证失败，则跳转到指定页面
        shiroFilterFactoryBean.setUnauthorizedUrl(unauthorizedUrl);
        // Shiro连接约束配置，即过滤链的定义

        LinkedHashMap<String, String> filterChainDefinitionMap = new LinkedHashMap<>();
        // 对静态资源设置匿名访问
        filterChainDefinitionMap.put("/favicon.ico**", "anon");
        filterChainDefinitionMap.put("/prometheus.png**", "anon");
        filterChainDefinitionMap.put("/css/**", "anon");
        filterChainDefinitionMap.put("/docs/**", "anon");
        filterChainDefinitionMap.put("/fonts/**", "anon");
        filterChainDefinitionMap.put("/img/**", "anon");
        filterChainDefinitionMap.put("/ajax/**", "anon");
        filterChainDefinitionMap.put("/js/**", "anon");
        filterChainDefinitionMap.put("/prometheus/**", "anon");
        filterChainDefinitionMap.put("/druid/**", "anon");
        filterChainDefinitionMap.put("/captcha/captchaImage**", "anon");

        // 退出 logout地址，shiro去清除session
        filterChainDefinitionMap.put("/logout", "logout");
        // 不需要拦截的访问
        filterChainDefinitionMap.put("/login", "anon,captchaValidate");
        //免登  不要拦截
        filterChainDefinitionMap.put("/oauth/get", "anon");


        // 系统权限列表
        // filterChainDefinitionMap.putAll(SpringUtils.getBean(IMenuService.class).selectPermsAll());

        Map<String, Filter> filters = new LinkedHashMap<>();
        // 表单过滤器
//        filters.put("myFormAuthenticationFilter", myFormAuthenticationFilter());

        filters.put("onlineSession", onlineSessionFilter());
        filters.put("syncOnlineSession", syncOnlineSessionFilter());
        filters.put("captchaValidate", captchaValidateFilter());
        filters.put("kickout", kickoutSessionFilter());

        // 注销成功，则跳转到指定页面
        filters.put("logout", logoutFilter());
        shiroFilterFactoryBean.setFilters(filters);

        // 所有请求需要认证
        filterChainDefinitionMap.put("/**", "user,kickout,onlineSession,syncOnlineSession");//myFormAuthenticationFilter
//        filterChainDefinitionMap.put("/**", "user,onlineSession,syncOnlineSession,myFormAuthenticationFilter");//myFormAuthenticationFilter

        shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);

        return shiroFilterFactoryBean;
    }


    /**
     * 表单过滤器
     */
//    public MyFormAuthenticationFilter myFormAuthenticationFilter() {
//        MyFormAuthenticationFilter myFormAuthenticationFilter = new MyFormAuthenticationFilter();
//        return myFormAuthenticationFilter;
//    }


    /**
     * CAS过滤器
     */
   /* @Bean
    public CasFilter casFilter() {
        CasFilter casFilter = new CasFilter();
        casFilter.setName("casFilter");
        casFilter.setEnabled(true);
        // 登录失败后跳转的URL，也就是 Shiro 执行 CasRealm 的 doGetAuthenticationInfo 方法向CasServer验证tiket
//        String loginUrl = casServerUrlPrefix + "/login?service=" + shiroServerUrlPrefix + casFilterUrlPattern;
        casFilter.setFailureUrl(loginUrl);// 我们选择认证失败后再打开登录页面
        return casFilter;
    }
*/

    /**
     * 自定义在线用户处理过滤器
     */
    @Bean
    public OnlineSessionFilter onlineSessionFilter() {
        OnlineSessionFilter onlineSessionFilter = new OnlineSessionFilter();
        onlineSessionFilter.setLoginUrl(loginUrl);
        return onlineSessionFilter;
    }

    /**
     * 自定义在线用户同步过滤器
     */
    @Bean
    public SyncOnlineSessionFilter syncOnlineSessionFilter() {
        return new SyncOnlineSessionFilter();
    }

    /**
     * 自定义验证码过滤器
     */
    @Bean
    public CaptchaValidateFilter captchaValidateFilter() {
        CaptchaValidateFilter captchaValidateFilter = new CaptchaValidateFilter();
        captchaValidateFilter.setCaptchaEnabled(captchaEnabled);
        captchaValidateFilter.setCaptchaType(captchaType);
        return captchaValidateFilter;
    }

    /**
     * 退出过滤器
     */
    public LogoutFilter logoutFilter() {
        LogoutFilter logoutFilter = new LogoutFilter();
        logoutFilter.setCacheManager(getEhCacheManager());
        logoutFilter.setLoginUrl(loginUrl);
        return logoutFilter;
    }

    /**************************************************************************************************************/

    /**
     * cookie 属性设置
     */
    public SimpleCookie rememberMeCookie() {
        SimpleCookie cookie = new SimpleCookie("rememberMe");
        cookie.setDomain(domain);
        cookie.setPath(path);
        cookie.setHttpOnly(httpOnly);
        cookie.setMaxAge(maxAge * 24 * 60 * 60);
        return cookie;
    }

    /**
     * 记住我
     */
    public CookieRememberMeManager rememberMeManager() {
        CookieRememberMeManager cookieRememberMeManager = new CookieRememberMeManager();
        cookieRememberMeManager.setCookie(rememberMeCookie());
        cookieRememberMeManager.setCipherKey(Base64.decode("fCq+/xW488hMTCD+cmJ3aQ=="));
        return cookieRememberMeManager;
    }

    /**
     * 同一个用户多设备登录限制
     */
    public KickoutSessionFilter kickoutSessionFilter() {
        KickoutSessionFilter kickoutSessionFilter = new KickoutSessionFilter();
        kickoutSessionFilter.setCacheManager(getEhCacheManager());
        kickoutSessionFilter.setSessionManager(sessionManager());
        // 同一个用户最大的会话数，默认-1无限制；比如2的意思是同一个用户允许最多同时两个人登录
        kickoutSessionFilter.setMaxSession(maxSession);
        // 是否踢出后来登录的，默认是false；即后者登录的用户踢出前者登录的用户；踢出顺序
        kickoutSessionFilter.setKickoutAfter(kickoutAfter);
        // 被踢出后重定向到的地址；
        kickoutSessionFilter.setKickoutUrl("/login?kickout=1");
        return kickoutSessionFilter;
    }

    /**
     * thymeleaf模板引擎和shiro框架的整合
     */
    @Bean
    public ShiroDialect shiroDialect() {
        return new ShiroDialect();
    }

    /**
     * 开启Shiro注解通知器
     */
    @Bean
    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor(
            @Qualifier("securityManager") SecurityManager securityManager) {
        AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor = new AuthorizationAttributeSourceAdvisor();
        authorizationAttributeSourceAdvisor.setSecurityManager(securityManager);
        return authorizationAttributeSourceAdvisor;
    }
}
