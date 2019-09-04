import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN.js' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'

import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'

//导入iconfont字体
import '@/assets/iconfont/iconfont.css'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 *
 * 上生产环境，需要将下面的代码给注释或去掉
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}
Vue.use(VXETable)
VXETable.use(VXETablePluginElement)
// set ElementUI lang to EN
Vue.use(ElementUI, { 
  size:'mini',  //全局size 字段，用于改变组件的默认尺寸
  locale
})
//全局挂载变量
import global_ from "@/utils/global"
Vue.prototype.GLOBAL = global_

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
