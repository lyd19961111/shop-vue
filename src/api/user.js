import request from '@/utils/request'
export default ({
  // 获取用户列表
  userList (query, pagenum, pagesize) {
    return request({
      url: '/users',
      method: 'get',
      params: {
        query,
        pagenum,
        pagesize
      }
    })
  },
  // 修改用户状态
  changeUseState (id, state) {
    return request({
      url: `/users/${id}/state/${state}`,
      method: 'put'
    })
  },

  // 添加用户
  addUser (addForm) {
    return request({
      url: '/users',
      method: 'post',
      data: addForm
    })
  },

  // 根据ID获取用户信息
  getId (id) {
    return request({
      url: `/users/${id}`,
      method: 'get'
    })
  },
  // 更新用户
  updateUser (editForm) {
    return request({
      url: `/users/${editForm.id}`,
      method: 'put',
      data: {
        email: editForm.email,
        mobile: editForm.mobile
      }
    })
  },
  // 删除用户
  deleteUser (id) {
    return request({
      url: `/users/${id}`,
      method: 'delete'
    })
  }
})
