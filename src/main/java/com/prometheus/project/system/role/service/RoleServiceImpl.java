package com.prometheus.project.system.role.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.prometheus.common.utils.DateUtils;
import com.prometheus.project.system.user.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.prometheus.common.constant.UserConstants;
import com.prometheus.common.exception.BusinessException;
import com.prometheus.common.utils.StringUtils;
import com.prometheus.common.utils.security.ShiroUtils;
import com.prometheus.common.utils.spring.SpringUtils;
import com.prometheus.common.utils.text.Convert;
import com.prometheus.framework.aspectj.lang.annotation.DataScope;
import com.prometheus.project.system.role.domain.Role;
import com.prometheus.project.system.role.domain.RoleDept;
import com.prometheus.project.system.role.domain.RoleMenu;
import com.prometheus.project.system.role.mapper.RoleDeptMapper;
import com.prometheus.project.system.role.mapper.RoleMapper;
import com.prometheus.project.system.role.mapper.RoleMenuMapper;
import com.prometheus.project.system.user.domain.UserRole;
import com.prometheus.project.system.user.mapper.UserRoleMapper;

/**
 * 角色 业务层处理
 *
 * @author chenzhi
 */
@Service
public class RoleServiceImpl implements IRoleService {
    @Autowired
    private RoleMapper roleMapper;

    @Autowired
    private RoleMenuMapper roleMenuMapper;

    @Autowired
    private UserRoleMapper userRoleMapper;

    @Autowired
    private RoleDeptMapper roleDeptMapper;

    /**
     * 根据条件分页查询角色数据
     *
     * @param role 角色信息
     * @return 角色数据集合信息
     */
    @Override
    @DataScope(deptAlias = "d")
    public List<Role> selectRoleList(Role role) {
        // 生成数据权限过滤条件
        if (!(User.isAdmin(ShiroUtils.getUserId()))) {
            role.setClientId(ShiroUtils.getSysUser().getClientId());
        }
        return roleMapper.selectRoleList(role);
    }

    /**
     * 根据用户ID查询权限
     *
     * @param userId 用户ID
     * @return 权限列表
     */
    @Override
    public Set<String> selectRoleKeys(Long userId) {
//        User user = new User();
//        user.setUserId(userId);
//        user.setClientId(ShiroUtils.getSysUser().getClientId());
//        List<Role> perms = roleMapper.selectRolesByUserId(user);
//        Set<String> permsSet = new HashSet<>();
//        for (Role perm : perms) {
//            if (StringUtils.isNotNull(perm)) {
//                permsSet.addAll(Arrays.asList(perm.getRoleKey().trim().split(",")));
//            }
//        }
//        return permsSet;

        List<Role> perms = roleMapper.selectRolesByUserId(userId);
        Set<String> permsSet = new HashSet<>();
        for (Role perm : perms) {
            if (StringUtils.isNotNull(perm)) {
                permsSet.addAll(Arrays.asList(perm.getRoleKey().trim().split(",")));
            }
        }
        return permsSet;
    }

    /**
     * 根据用户ID查询角色
     *
     * @param userId 用户ID
     * @return 角色列表
     */
    @Override
    public List<Role> selectRolesByUserId(Long userId) {//,Long clientId
//        User user = new User();
//        user.setUserId(userId);
//        List<Role> userRoles = roleMapper.selectRolesByUserId(user);
//        Role roleIndex = new Role();
//        roleIndex.setClientId(clientId);
//        List<Role> roles = selectRoleByClientId(roleIndex);
//        for (Role role : roles) {
//            for (Role userRole : userRoles) {
//                if (role.getRoleId().longValue() == userRole.getRoleId().longValue()) {
//                    role.setFlag(true);
//                    break;
//                }
//            }
//        }
//        return roles;
        List<Role> userRoles = roleMapper.selectRolesByUserId(userId);
        List<Role> roles = selectRoleAll();
        for (Role role : roles) {
            for (Role userRole : userRoles) {
                if (role.getRoleId().longValue() == userRole.getRoleId().longValue()) {
                    role.setFlag(true);
                    break;
                }
            }
        }
        return roles;
    }

    /**
     * 查询所有角色
     *
     * @return 角色列表
     */
    @Override
    public List<Role> selectRoleAll() {
        return SpringUtils.getAopProxy(this).selectRoleList(new Role());
    }

    /**
     * 通过角色ID查询角色
     *
     * @param roleId 角色ID
     * @return 角色对象信息
     */
    @Override
    public Role selectRoleById(Long roleId) {
        Role role = new Role();
        role.setRoleId(roleId);
        //不是超级管理员
        if (!User.isAdmin(ShiroUtils.getUserId())) {
            role.setClientId(ShiroUtils.getSysUser().getClientId());
        }
        return roleMapper.selectRoleById(role);
    }

    /**
     * 通过机构ID查询角色
     *
     * @param role 角色
     * @return 角色对象信息
     */
    @Override
    public List<Role> selectRoleByClientId(Role role) {
        return roleMapper.selectRoleByClientId(role);
    }

    /**
     * 通过角色ID删除角色
     *
     * @param roleId 角色ID
     * @return 结果
     */
    @Override
    public boolean deleteRoleById(Long roleId) {
        return roleMapper.deleteRoleById(roleId) > 0 ? true : false;
    }

    /**
     * 批量删除角色信息
     *
     * @param ids 需要删除的数据ID
     * @throws Exception
     */
    @Override
    public int deleteRoleByIds(String ids) throws BusinessException {
        Long[] roleIds = Convert.toLongArray(ids);
        for (Long roleId : roleIds) {
            checkRoleAllowed(new Role(roleId));
            Role role = selectRoleById(roleId);
            if (countUserRoleByRoleId(roleId) > 0) {
                throw new BusinessException(String.format("%1$s已分配,不能删除", role.getRoleName()));
            }
        }
        return roleMapper.deleteRoleByIds(roleIds);
    }

    /**
     * 新增保存角色信息
     *
     * @param role 角色信息
     * @return 结果
     */
    @Override
    @Transactional
    public int insertRole(Role role) {
        role.setCreateBy(ShiroUtils.getLoginName());
        role.setCreateTime(DateUtils.getNowDate());
        // 新增角色信息
        roleMapper.insertRole(role);
        ShiroUtils.clearCachedAuthorizationInfo();
        return insertRoleMenu(role);
    }

    /**
     * 修改保存角色信息
     *
     * @param role 角色信息
     * @return 结果
     */
    @Override
    @Transactional
    public int updateRole(Role role) {
        role.setUpdateBy(ShiroUtils.getLoginName());
        role.setUpdateTime(DateUtils.getNowDate());
        // 修改角色信息
        roleMapper.updateRole(role);
        ShiroUtils.clearCachedAuthorizationInfo();
        // 删除角色与菜单关联
        roleMenuMapper.deleteRoleMenuByRoleId(role.getRoleId());
        return insertRoleMenu(role);
    }

    /**
     * 修改数据权限信息
     *
     * @param role 角色信息
     * @return 结果
     */
    @Override
    @Transactional
    public int authDataScope(Role role) {
        role.setUpdateBy(ShiroUtils.getLoginName());
        role.setUpdateTime(DateUtils.getNowDate());
        // 修改角色信息
        roleMapper.updateRole(role);
        // 删除角色与部门关联
        roleDeptMapper.deleteRoleDeptByRoleId(role.getRoleId());
        // 新增角色和部门信息（数据权限）
        return insertRoleDept(role);
    }

    /**
     * 新增角色菜单信息
     *
     * @param role 角色对象
     */
    public int insertRoleMenu(Role role) {
        int rows = 1;
        // 新增用户与角色管理
        List<RoleMenu> list = new ArrayList<RoleMenu>();
        for (Long menuId : role.getMenuIds()) {
            RoleMenu rm = new RoleMenu();
            rm.setRoleId(role.getRoleId());
            rm.setMenuId(menuId);
            list.add(rm);
        }
        if (list.size() > 0) {
            rows = roleMenuMapper.batchRoleMenu(list);
        }
        return rows;
    }

    /**
     * 新增角色部门信息(数据权限)
     *
     * @param role 角色对象
     */
    public int insertRoleDept(Role role) {
        int rows = 1;
        // 新增角色与部门（数据权限）管理
        List<RoleDept> list = new ArrayList<RoleDept>();
        for (Long deptId : role.getDeptIds()) {
            RoleDept rd = new RoleDept();
            rd.setRoleId(role.getRoleId());
            rd.setDeptId(deptId);
            list.add(rd);
        }
        if (list.size() > 0) {
            rows = roleDeptMapper.batchRoleDept(list);
        }
        return rows;
    }

    /**
     * 校验角色名称是否唯一
     *
     * @param role 角色信息
     * @return 结果
     */
    @Override
    public String checkRoleNameUnique(Role role) {
        Long roleId = StringUtils.isNull(role.getRoleId()) ? -1L : role.getRoleId();
        //   应该带着机构走，不同机构的可以有相同的角色名称
        Role info = roleMapper.checkRoleNameUnique(role);
        if (StringUtils.isNotNull(info) && info.getRoleId().longValue() != roleId.longValue()) {
            return UserConstants.ROLE_NAME_NOT_UNIQUE;
        }
        return UserConstants.ROLE_NAME_UNIQUE;
    }

    /**
     * 校验角色权限是否唯一
     *
     * @param role 角色信息
     * @return 结果
     */
    @Override
    public String checkRoleKeyUnique(Role role) {
        Long roleId = StringUtils.isNull(role.getRoleId()) ? -1L : role.getRoleId();
        // TODO  应该带着机构走，不同机构的可以有相同的角色名称
        Role info = roleMapper.checkRoleKeyUnique(role.getRoleKey());
        if (StringUtils.isNotNull(info) && info.getRoleId().longValue() != roleId.longValue()) {
            return UserConstants.ROLE_KEY_NOT_UNIQUE;
        }
        return UserConstants.ROLE_KEY_UNIQUE;
    }

    /**
     * 校验角色是否允许操作
     *
     * @param role 角色信息
     */
    public void checkRoleAllowed(Role role) {
        if (StringUtils.isNotNull(role.getRoleId()) && role.isAdmin()) {
            throw new BusinessException("不允许操作超级管理员角色");
        }
    }

    /**
     * 通过角色ID查询角色使用数量
     *
     * @param roleId 角色ID
     * @return 结果
     */
    @Override
    public int countUserRoleByRoleId(Long roleId) {
        return userRoleMapper.countUserRoleByRoleId(roleId);
    }

    /**
     * 角色状态修改
     *
     * @param role 角色信息
     * @return 结果
     */
    @Override
    public int changeStatus(Role role) {
        return roleMapper.updateRole(role);
    }

    /**
     * 取消授权用户角色
     *
     * @param userRole 用户和角色关联信息
     * @return 结果
     */
    @Override
    public int deleteAuthUser(UserRole userRole) {
        return userRoleMapper.deleteUserRoleInfo(userRole);
    }

    /**
     * 批量取消授权用户角色
     *
     * @param roleId  角色ID
     * @param userIds 需要删除的用户数据ID
     * @return 结果
     */
    public int deleteAuthUsers(Long roleId, String userIds) {
        return userRoleMapper.deleteUserRoleInfos(roleId, Convert.toLongArray(userIds));
    }

    /**
     * 批量选择授权用户角色
     *
     * @param roleId  角色ID
     * @param userIds 需要删除的用户数据ID
     * @return 结果
     */
    public int insertAuthUsers(Long roleId, String userIds) {
        Long[] users = Convert.toLongArray(userIds);
        // 新增用户与角色管理
        List<UserRole> list = new ArrayList<UserRole>();
        for (Long userId : users) {
            UserRole ur = new UserRole();
            ur.setUserId(userId);
            ur.setRoleId(roleId);
            list.add(ur);
        }
        return userRoleMapper.batchUserRole(list);
    }
}
