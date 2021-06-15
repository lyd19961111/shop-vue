import request from '@/utils/request.js'

export default{
    login(username,password){
        return request({
         url:'/login',
            method:'post',
            data:{
            username,
            password
            }
        })
    }
}