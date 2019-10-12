import { constantRoutes } from '@/router'
import { generateRoutes } from '@/api/promissions'
import Layout from '@/layout'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes //这个是实际的路由信息
    state.routes = constantRoutes.concat(routes) //这个是用来后台侧边栏菜单显示内容。就是src/layout/components/Sidebar/index.vue里面sidebar-item组件进行渲染的数据
  }
}

const actions = {
  generateRoutes({ commit }, data){
    return new Promise((resolve, reject) => {
      generateRoutes(data).then(response=>{
        const accessedRouters = convertRouter(response.data.menus)
        commit('SET_ROUTES', accessedRouters)
        //请求继续往下进行，不会进行阻塞
        resolve(accessedRouters)
      }).catch(error=>{
        reject(error)
      })
    })
  }
}

/**
 *将后台的路由表进行格式化
 * @param {*} asyncRouterMap
 */
function convertRouter(asyncRouterMap) {
  const accessedRouters = []
  if(asyncRouterMap){
    asyncRouterMap.forEach(item =>{
      var isParent = false
      if(item.children){
        isParent = true
      }
      var parent = generateRouter(item,isParent)
      var menuChildren = []
      if(item.children){
        item.children.forEach(child => {
          let childRouter = generateRouter(child,false)
          menuChildren.push(childRouter)
        })
      }
      parent.children = menuChildren
      accessedRouters.push(parent)
    })
  }
  //在router/index.js中不要定义这行路由信息，而是通过这样的方式来动态添加，
  accessedRouters.push({ path: '*', redirect: '/404', hidden: true })
  return accessedRouters
}

// 对component的处理
function generateRouter(item, isParent) {
  var component = Layout // 多层嵌套时只能有一个Layout
  if (isParent !== true) {
    let subComponent = item.path
    component = componentsMap[item.component]
  }
  var router = {
    path: item.path,
    name: item.name,
    meta: item.meta,  //meta用来显示菜单名称
    hidden: item.hidden,
    component: component
  }
  return router
}
// componentsMap 需要在事先定义好
export const componentsMap = {
  addAricle:() => import('@/views/article/create'),
  listAricle:() => import('@/views/article/index'),
  listPage:() => import('@/views/pages/index'),
  editPage:() => import('@/views/pages/edit'),
  listCategories:() => import('@/views/categories/index'),
  editArticle: () => import('@/views/article/edit'),
  promissions: () => import('@/views/promissions/index'), 
  roles: () => import('@/views/roles/index'), 
  list: () => import('@/views/adminuser/index') 
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}