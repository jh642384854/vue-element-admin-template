import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/adminuser',
    component: Layout,
    redirect: '/adminuser/list',
    name: '权限管理',
    meta: { title: '权限管理', icon: 'example' },
    children: [
      {
        path: 'promissions',
        name: '权限',
        component: () => import('@/views/promissions/index'),
        meta: { title: '权限', icon: 'table' }
      },
      {
        path: 'roles',
        name: '角色',
        component: () => import('@/views/roles/index'),
        meta: { title: '角色', icon: 'tree' }
      },
      {
        path: 'list',
        name: '管理员',
        component: () => import('@/views/adminuser/index'),
        meta: { title: '管理员', icon: 'tree' }
      }
    ]
  },

  {
    path: '/article',
    component: Layout,
    redirect: '/article/list',
    name: '内容管理',
    meta: { title: '内容管理', icon: 'example' },
    children: [
      {
        path: 'add',
        name: '添加文章',
        component: () => import('@/views/article/create'),
        meta: { title: '添加文章', icon: 'table' }
      },
      {
        path: 'articleedit/:id(\\d+)',
        component: () => import('@/views/article/edit'),
        name: '修改文章',
        meta: { title: '修改文章', noCache: true, activeMenu: '/article/list' },
        hidden: true
      },
      {
        path: 'list',
        name: '文章管理',
        component: () => import('@/views/article/index'),
        meta: { title: '文章管理', icon: 'table' }
      },
      {
        path: 'page',
        name: '单页内容',
        component: () => import('@/views/pages/index'),
        meta: { title: '单页内容', icon: 'table' }
      },
      {
        path: 'pageedit/:id(\\d+)',
        component: () => import('@/views/pages/edit'),
        name: '修改单页',
        meta: { title: '修改单页', noCache: true, activeMenu: '/article/page' },
        hidden: true
      },
      {
        path: 'categories',
        name: '栏目',
        component: () => import('@/views/categories/index'),
        meta: { title: '栏目', icon: 'tree' }
      },
      {
        path: 'comments',
        name: '评论',
        component: () => import('@/views/test/index'),
        meta: { title: '评论', icon: 'tree' }
      }
    ]
  },

  {
    path: '/settings',
    component: Layout,
    redirect: '/settings/sys',
    name: '系统设置',
    meta: { title: '系统设置', icon: 'example' },
    children: [
      {
        path: 'sys',
        name: '系统设置',
        component: () => import('@/views/settings/sys'),
        meta: { title: '系统设置', icon: 'table' }
      },
      {
        path: 'diy',
        name: '自定义设置',
        component: () => import('@/views/test/index'),
        meta: { title: '自定义设置', icon: 'tree' }
      },
      {
        path: 'smtp',
        name: 'SMTP设置',
        component: () => import('@/views/settings/email'),
        meta: { title: 'SMTP设置', icon: 'tree' }
      }
    ]
  },

  {
    path: '/wxgzh',
    component: Layout,
    redirect: '/wxgzh/config',
    name: '微信公众号',
    meta: { title: '微信公众号', icon: 'example' },
    children: [
      {
        path: 'config',
        name: '公众号设置',
        component: () => import('@/views/test/index'),
        meta: { title: '公众号设置', icon: 'table' },
        children:[
          {
            path: 'config',
            name: '接口配置',
            component: () => import('@/views/test/index'),
            meta: { title: '公众号接口配置', icon: 'table' },
          },
          {
            path: 'wxmenu',
            name: '菜单配置',
            component: () => import('@/views/test/index'),
            meta: { title: '公众号菜单配置', icon: 'table' },
          },
          {
            path: 'tplmessage',
            name: '微信模版消息',
            component: () => import('@/views/test/index'),
            meta: { title: '微信模版消息', icon: 'table' },
          }
        ]
      },
      {
        path: 'pageconfig',
        name: '页面设置',
        component: () => import('@/views/test/index'),
        meta: { title: '页面设置', icon: 'tree' }
      },
      {
        path: 'autoreply',
        name: '自动回复',
        component: () => import('@/views/test/index'),
        meta: { title: '自动回复', icon: 'tree' },
        children:[
          {
            path: 'focus',
            name: '微信关注回复',
            component: () => import('@/views/test/index'),
            meta: { title: '微信关注回复', icon: 'table' },
          },
          {
            path: 'key',
            name: '关键字回复',
            component: () => import('@/views/test/index'),
            meta: { title: '关键字回复', icon: 'table' },
          },
          {
            path: '无效关键字回复',
            name: 'nousekey',
            component: () => import('@/views/test/index'),
            meta: { title: '无效关键字回复', icon: 'table' },
          }
        ]
      },
      {
        path: 'customermanage',
        name: '客服管理',
        component: () => import('@/views/test/index'),
        meta: { title: '客服管理', icon: 'tree' }
      },
      {
        path: 'picturetext',
        name: '图文管理',
        component: () => import('@/views/test/index'),
        meta: { title: '图文管理', icon: 'tree' }
      }
    ]
  },

  {
    path: '/wxxcx',
    component: Layout,
    redirect: '/wxxcx/config',
    name: '微信小程序',
    meta: { title: '微信小程序', icon: 'example' },
    children: [
      {
        path: 'config',
        name: '小程序配置',
        component: () => import('@/views/test/index'),
        meta: { title: '小程序配置', icon: 'table' }
      },
      {
        path: 'tplmessage',
        name: '小程序模版消息',
        component: () => import('@/views/test/index'),
        meta: { title: '小程序模版消息', icon: 'tree' }
      },
      {
        path: 'data',
        name: '模块数据配置',
        component: () => import('@/views/test/index'),
        meta: { title: '模块数据配置', icon: 'tree' },
        children:[
          {
            path: 'index_flash',
            name: '首页幻灯片',
            component: () => import('@/views/test/index'),
            meta: { title: '首页幻灯片', icon: 'tree' },
          },
          {
            path: 'index_menu',
            name: '首页导航按钮',
            component: () => import('@/views/test/index'),
            meta: { title: '首页导航按钮', icon: 'tree' },
          },
        ]
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: '会员管理',
    meta: { title: '会员管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: '会员管理',
        component: () => import('@/views/test/index'),
        meta: { title: '会员管理', icon: 'table' }
      },
      {
        path: 'config',
        name: '会员系统配置',
        component: () => import('@/views/test/index'),
        meta: { title: '会员系统配置', icon: 'tree' }
      }
    ]
  },

  {
    path: '/operation',
    component: Layout,
    redirect: '/operation/advs/list',
    name: '运营管理',
    meta: { title: '运营管理', icon: 'example' },
    children: [
      {
        path: 'advs',
        name: '广告管理',
        component: () => import('@/views/advs/index'),
        meta: { title: '广告管理', icon: 'table' },
        children:[
          {
            path: 'categories',
            name: '广告类别',
            component: () => import('@/views/advs/advcategories'),
            meta: { title: '广告类别', icon: 'table' }
          },
          {
            path: 'list',
            name: '广告列表',
            component: () => import('@/views/advs/list'),
            meta: { title: '广告列表', icon: 'table' }
          }
        ] 
      },
      {
        path: 'links',
        name: '友情链接',
        component: () => import('@/views/links/list'),
        meta: { title: '友情链接', icon: 'table' } 
      },
      {
        path: 'forms',
        name: '表单管理',
        component: () => import('@/views/test/index'),
        meta: { title: '表单管理', icon: 'table' },
        children:[
          {
            path: 'formstpl',
            name: '表单模版',
            component: () => import('@/views/test/index'),
            meta: { title: '表单模版', icon: 'table' }
          },
          {
            path: 'forminstance',
            name: '表单实例',
            component: () => import('@/views/test/index'),
            meta: { title: '表单实例', icon: 'table' }
          }
        ] 
      }
    ]
  },
//http://demo26.crmeb.net/admin/index/index.html
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
