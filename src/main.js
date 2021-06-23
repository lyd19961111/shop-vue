import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import App from './App.vue'
import router from './router'
import store from './store'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入全局样式表
import '@/assets/css/global.css'
import '@/assets/font/iconfont.css'
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor /* { default global options } */)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
