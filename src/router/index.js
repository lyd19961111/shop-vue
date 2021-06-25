import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const VueRouterPush = VueRouter.prototype.push

VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue')
  },
  {
    path: '/home',
    component: () => import('@/views/Home/Home.vue'),
    redirect: '/webmain',
    children: [
      {
        path: '/webmain',
        component: () => import('@/views/webMain/webMain.vue')
      },
      {
        path: '/users',
        component: () => import('@/views/webMain/userManage/userManage.vue')
      },
      {
        path: '/rights',
        component: () => import('@/views/webMain/authManage/powerList.vue')
      },
      {
        path: '/roles',
        component: () => import('@/views/webMain/authManage/roleList.vue')
      },
      {
        path: '/categories',
        component: () => import('@/views/webMain/goodsManage/goodSort.vue')
      },
      {
        path: '/params',
        component: () => import('@/views/webMain/goodsManage/goodParam.vue')
      },
      {
        path: '/goods',
        component: () => import('@/views/webMain/goodsManage/goodList.vue')
      },
      {
        path: '/goods/add',
        component: () => import('@/views/webMain/goodsManage/addGood.vue')
      },
      {
        path: '/orders',
        component: () => import('@/views/webMain/orderManage/orderList.vue')
      },
      {
        path: '/reports',
        component: () => import('@/views/webMain/echartManage/echartManage.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = window.sessionStorage.getItem('token')
    if (!token) {
      next('/login')
    } else {
      next()
    }
  }
})
export default router
