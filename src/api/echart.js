import request from '../utils/request'
export default {
  getEchart () {
    return request({
      url: '/reports/type/1',
      method: 'get'
    })
  }
}
