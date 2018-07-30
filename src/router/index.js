import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import login from '@/components/login'
import children from './children'
Vue.use(Router)

//const router =   
export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      children: [...children],
      meta: {
        title: '后台首页',
        isVerify: true
      }
    },
  ]
})
// 路由全局守卫
// router.beforeEach(function (to, from, next) {
//   // to: Route: 即将要进入的目标 路由对象
//   // from: Route: 当前导航正要离开的路由
//   // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
//   const isLog = window.sessionStorage.getItem('isLog') == 'true' ? true : false;
//   if (to.matched.some(r => r.meta.isVerify)) {
//     if (!isLog) {
//       next({
//         name: 'login',
//         query: {
//           redirect: to.fullPath// 将跳转的路由path作为参数，登录成功后跳转到该路由
//         }
//       })
//     } else {
//       next()
//     }
//   } else {
//     next()
//   }
//   document.title = to.meta.title
// })
// export default router
