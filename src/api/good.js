import request from '../utils/request'
export default {
  // 商品分类接口
  // 商品分类列表
  goodList (queryInfo) {
    return request({
      url: '/categories',
      method: 'get',
      params: {
        type: queryInfo.type,
        pagenum: queryInfo.pagenum,
        pagesize: queryInfo.pagesize
      }
    })
  },
  getParentGood () {
    return request({
      url: '/categories',
      methods: 'get',
      params: {
        type: 2
      }
    })
  },
  saveGood (saveForm) {
    return request({
      url: '/categories',
      method: 'post',
      data: saveForm
    })
  },
  // 跟新分类
  updateGood (editForm) {
    return request({
      url: `/categories/${editForm.cat_id}`,
      method: 'put',
      data: {
        cat_name: editForm.cat_name
      }
    })
  },
  // 删除分类
  delGood (id) {
    return request({
      url: `/categories/${id}`,
      method: 'delete'
    })
  },

  // ------------------
  // 分类参数接口
  getParam () {
    return request({
      url: '/categories',
      method: 'get'
    })
  },
  // 获取动态参数和静态参数列表
  getList (id, state) {
    console.log('1aa', id)
    return request({
      url: `/categories/${id}/attributes`,
      method: 'get',
      params: {
        sel: state
      }
    })
  },
  // 确定添加参数
  updateParam (id, form, type) {
    return request({
      url: `/categories/${id}/attributes`,
      method: 'post',
      data: {
        attr_name: form.attr_name,
        attr_sel: type
      }
    })
  },
  // 更新动态参数
  updateMany (id, form, type) {
    return request({
      url: `/categories/${id}/attributes/${form.attr_id}`,
      method: 'put',
      data: {
        attr_sel: type,
        attr_name: form.attr_name
      }
    })
  },
  // 删除
  delMany (id, attrid) {
    return request({
      url: `categories/${id}/attributes/${attrid}`,
      method: 'delete'
    })
  },
  // 保存tags
  addTag (id, row) {
    return request({
      url: `/categories/${id}/attributes/${row.attr_id}`,
      method: 'put',
      data: {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      }

    })
  },
  // --------------------
  // 商品列表数据接口
  getlist (info) {
    return request({
      url: '/goods',
      method: 'get',
      params: {
        query: info.query,
        pagenum: info.pagenum,
        pagesize: info.pagesize
      }
    })
  },
  // 商品列表编辑提交
  updateGoodList (form) {
    return request({
      url: `/goods/${form.goods_id}`,
      method: 'put',
      data: {
        goods_name: form.goods_name,
        goods_price: form.goods_price,
        goods_number: form.goods_number,
        goods_weight: form.goods_weight
      }
    })
  },
  // 删除
  deleteGood (id) {
    return request({
      url: `/goods/${id}`,
      method: 'delete'
    })
  }

}
