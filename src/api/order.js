import request from '../utils/request'
export default {
  // 订单列表接口
  getList (info) {
    return request({
      url: '/orders',
      method: 'get',
      params: {
        query: info.query,
        pagenum: info.pagenum,
        pagesize: info.pagesize
      }
    })
  },
  // 物流信息
  getlogistics () {
    return request({
      url: '/kuaidi/1106975712662',
      method: 'get'
    })
  }
}
