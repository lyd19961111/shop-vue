import request from '../utils/request'
export default {
  getPowerList () {
    return request({
      url: '/rights/list',
      method: 'get'
    })
  },
  // 获取角色列表
  getRole () {
    return request({
      url: '/roles',
      method: 'get'
    })
  },
  // 删除角色权限
  delRoleAuth (role, itemId) {
    console.log('33333', role.id, itemId)
    return request({
      url: `/roles/${role.id}/rights/${itemId}`,
      method: 'delete'
    })
  },
  // 获取权限树的数据
  getTree () {
    return request({
      url: '/rights/tree',
      method: 'get'
    })
  },

  // 增加权限
  addRole (roleId, str) {
    return request({
      url: `/roles/${roleId}/rights`,
      method: 'post',
      data: {
        rids: str
      }
    })
  },
  // 添加角色
  addAssignRole (addForm) {
    return request({
      url: '/roles',
      method: 'post',
      data: {
        roleName: addForm.roleName,
        roleDesc: addForm.roleDesc

      }
    })
  },
  // 更新角色
  updateAssgin (editForm) {
    return request({
      url: `/roles/${editForm.id}`,
      method: 'put',
      data: {
        roleName: editForm.roleName,
        roleDesc: editForm.roleDesc
      }
    })
  },
  // 删除角色
  delAssign (id) {
    return request({
      url: `/roles/${id}`,
      method: 'delete'
    })
  }

}
