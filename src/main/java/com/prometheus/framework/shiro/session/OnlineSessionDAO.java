package com.prometheus.framework.shiro.session;

import java.io.Serializable;
import java.util.Date;

import com.prometheus.common.utils.StringUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.session.UnknownSessionException;
import org.apache.shiro.session.mgt.SimpleSession;
import org.apache.shiro.session.mgt.eis.EnterpriseCacheSessionDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import com.prometheus.framework.manager.AsyncManager;
import com.prometheus.framework.manager.factory.AsyncFactory;
import com.prometheus.project.monitor.online.domain.OnlineSession;
import com.prometheus.project.monitor.online.domain.UserOnline;
import com.prometheus.project.monitor.online.service.IUserOnlineService;

/**
 * 针对自定义的ShiroSession的db操作
 *
 * @author chenzhi
 */
public class OnlineSessionDAO extends EnterpriseCacheSessionDAO {
    /**
     * 同步session到数据库的周期 单位为毫秒（默认1分钟）
     */
    @Value("${shiro.session.dbSyncPeriod}")
    private int dbSyncPeriod;

    /**
     * 上次同步数据库的时间戳
     */
    private static final String LAST_SYNC_DB_TIMESTAMP = OnlineSessionDAO.class.getName() + "LAST_SYNC_DB_TIMESTAMP";

    @Autowired
    private IUserOnlineService onlineService;

    @Autowired
    private OnlineSessionFactory onlineSessionFactory;

    public OnlineSessionDAO() {
        super();
    }

    public OnlineSessionDAO(long expireTime) {
        super();
    }

    /**
     * 根据会话ID获取会话
     *
     * @param sessionId 会话ID
     * @return ShiroSession
     */
    @Override
    protected Session doReadSession(Serializable sessionId) {
//        Session session =  super.readSession(sessionId);
//        // 如果session已经被删除，则从数据库中查询session
//        if(session == null){
//            UserOnline userOnline = onlineService.selectOnlineById(String.valueOf(sessionId));
//            if (StringUtils.isNotNull(userOnline)) {
//                session = userOnline.getSession();
//            }
//        }
//        // 如果是APP则更新lastAccessTime
//      　User user = getUser(sessionId);
//        if(StringUtils.isNotNull(user)){
//            // 如果该用户是APP用户（user不为空说明就是），则判断session是否过期，如果过期则修改最后访问时间
//            ((SimpleSession)session).setLastAccessTime(new Date());
//        }

        UserOnline userOnline = onlineService.selectOnlineById(String.valueOf(sessionId));
        if (userOnline == null) {
            return null;
        }
        return onlineSessionFactory.createSession(userOnline);
    }

    @Override
    public void update(Session session) throws UnknownSessionException {
        super.update(session);
    }

    /**
     * 更新会话；如更新会话最后访问时间/停止会话/设置超时时间/设置移除属性等会调用
     */
    public void syncToDb(OnlineSession onlineSession) {
        Date lastSyncTimestamp = (Date) onlineSession.getAttribute(LAST_SYNC_DB_TIMESTAMP);
        if (lastSyncTimestamp != null) {
            boolean needSync = true;
            long deltaTime = onlineSession.getLastAccessTime().getTime() - lastSyncTimestamp.getTime();
            if (deltaTime < dbSyncPeriod * 60 * 1000) {
                // 时间差不足 无需同步
                needSync = false;
            }
            // isGuest = true 访客
            boolean isGuest = onlineSession.getUserId() == null || onlineSession.getUserId() == 0L;

            // session 数据变更了 同步
            if (isGuest == false && onlineSession.isAttributeChanged()) {
                needSync = true;
            }

            if (needSync == false) {
                return;
            }
        }
        // 更新上次同步数据库时间
        onlineSession.setAttribute(LAST_SYNC_DB_TIMESTAMP, onlineSession.getLastAccessTime());
        // 更新完后 重置标识
        if (onlineSession.isAttributeChanged()) {
            onlineSession.resetAttributeChanged();
        }
        AsyncManager.me().execute(AsyncFactory.syncSessionToDb(onlineSession));
    }

    /**
     * 当会话过期/停止（如用户退出时）属性等会调用
     */
    @Override
    protected void doDelete(Session session) {
        OnlineSession onlineSession = (OnlineSession) session;
        if (null == onlineSession) {
            return;
        }
        onlineSession.setStatus(OnlineSession.OnlineStatus.off_line);
        onlineService.deleteOnlineById(String.valueOf(onlineSession.getId()));
    }
}
