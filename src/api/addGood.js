import request from '../utils/request'
export default {
  // 商品分类数据
  getSortList () {
    return request({
      url: '/categories',
      method: 'get'
    })
  },
  // 访问参数面板
  allowMany (id) {
    return request({
      url: `/categories/${id}/attributes`,
      method: 'get',
      params: {
        sel: 'many'
      }
    })
  },
  // 访问静态参数
  allowOnly (id) {
    return request({
      url: `/categories/${id}/attributes`,
      method: 'get',
      params: {
        sel: 'only'
      }
    })
  },
  // 增加商品
  addaaa (form) {
    return request({
      url: '/goods',
      method: 'post',
      data: form
    })
  }
}
