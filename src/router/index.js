import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
      path:'',
      redirect:'/login'
  },
  {
    path:'/login',
    component:()=>import("@/views/Login/Login.vue") 
  },
  {
    path:'/home',
    component:()=>import("@/views/Home/Home.vue")
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//挂载路由导航守卫
 router.beforeEach((to,from,next)=>{
   if(to.path==='/login'){
     next()
   }else{
     const token=window.sessionStorage.getItem('token');
     if(!token){
       next('/login')
     }else{
       next()
     }
   }
 })
export default router
