// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 引入vue
import Vue from 'vue'
import App from './App'
// 引入路由
import router from './router'
// 引入elementUI
import elementui from 'element-ui'
import axios from 'axios'
// axios.defaults.withCredentials=true
Vue.prototype.$axios=axios
Vue.prototype.$userToken='4eaabded5c1f480d807a598187aef982'
// Vue.prototype.$host="http://mtapi.shushengchangjuan.cn"
// 引入css文件
import 'element-ui/lib/theme-chalk/index.css'
import './assets/iconfont/iconfont.css'
import '../static/css/common.css'
Vue.config.productionTip = false
Vue.use(elementui)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
