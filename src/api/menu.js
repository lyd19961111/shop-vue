import request from '@/utils/request.js'

export default {
    getMenu() {
        return request({
            url: '/menus',
            method: 'get',
        })
    }
}