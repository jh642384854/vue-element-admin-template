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
      }
    ]
  },

  {
    path: '/settings',
    component: Layout,
    redirect: '/settings/sys',
    name: '系统管理',
    meta: { title: '系统管理', icon: 'example' },
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
        component: () => import('@/views/settings/diy'),
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
    redirect: '/wxgzh/list',
    name: '微信公众号',  //这块功能可以参考http://www.jhweiphp.com(自己搭建的weiphp项目)，官方文档地址https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html 
    meta: { title: '微信公众号', icon: 'example' },
    children: [
      {
        path: 'list',
        name: '公众号列表',
        component: () => import('@/views/wxgzh/list'),
        meta: { title: '公众号列表', icon: 'table' }
      },
      {
        path: 'create',
        name: '创建公众号',
        component: () => import('@/views/wxgzh/create'),
        meta: { title: '创建公众号', icon: 'table' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/wxgzh/edit'),
        name: '修改公众号',
        meta: { title: '修改公众号',  activeMenu: '/wxgzh/list' },
        hidden: true
      },
      {
        path: 'paysetting/:id(\\d+)',
        component: () => import('@/views/wxgzh/paysetting'),
        name: '公众号支付配置',
        meta: { title: '公众号支付配置', activeMenu: '/wxgzh/list' },
        hidden: true
      },
      {
        path: 'noselectwx',
        component: () => import('@/views/wxgzh/noselectwx'),
        name: '选择要操作的公众号',
        meta: { title: '选择要操作的公众号', activeMenu: '/wxgzh/list' },
        hidden: true
      },
      {
        path: 'basesetting',
        component: () => import('@/views/wxgzh/basesetting'),
        redirect: '/wxgzh/basesetting/welcome',
        name: '公众号基本配置',
        meta: { title: '公众号基本配置', icon: 'table'  },
        children:[
          {
            path: 'welcome',
            name: '欢迎语设置',
            component: () => import('@/views/wxgzh/basesetting/welcome'),
            meta: { title: '欢迎语设置', icon: 'table' }
          },
          {
            path: 'diyreply',
            name: '自定义回复',
            redirect: '/wxgzh/basesetting/diyreply/list',
            component: () => import('@/views/wxgzh/basesetting/diyreplymsg/index'),
            meta: { title: '自定义回复', icon: 'table' },
            children:[
              {
                path: 'list',
                name: '自定义回复列表',
                component: () => import('@/views/wxgzh/basesetting/diyreplymsg/list'),
                meta: { title: '自定义回复列表', icon: 'table' }
              },
              {
                path: 'create',
                name: '创建自定义回复',
                component: () => import('@/views/wxgzh/basesetting/diyreplymsg/create'),
                meta: { title: '创建自定义回复', icon: 'table' }
              },
              {
                path: 'edit/:id(\\d+)',
                name: '修改自定义回复',
                component: () => import('@/views/wxgzh/basesetting/diyreplymsg/edit'),
                meta: { title: '修改自定义回复', icon: 'table' },
                hidden: true
              },
            ]
          },
          {
            path: 'unknowreply',
            name: '未识别回复',
            component: () => import('@/views/wxgzh/basesetting/unknowreply'),
            meta: { title: '未识别回复', icon: 'table' }
          },
          {
            path: 'material',
            name: '素材管理',
            component: () => import('@/views/wxgzh/basesetting/material/index'),
            redirect: '/wxgzh/basesetting/material/text',
            meta: { title: '素材管理', icon: 'table' },
            children:[
              {
                path: 'text',
                name: '文本素材',
                component: () => import('@/views/wxgzh/basesetting/material/text'),
                meta: { title: '文本素材', icon: 'table' }
              },
              {
                path: 'picture',
                name: '图片素材',
                component: () => import('@/views/wxgzh/basesetting/material/picture'),
                meta: { title: '图片素材', icon: 'table' }
              },
              {
                path: 'picture_text',
                name: '图文素材',
                component: () => import('@/views/wxgzh/basesetting/material/picture_text'),
                meta: { title: '图文素材', icon: 'table' }
              },
              {
                path: 'voice',
                name: '音频素材',
                component: () => import('@/views/wxgzh/basesetting/material/voice'),
                meta: { title: '音频素材', icon: 'table' }
              },
              {
                path: 'video',
                name: '视频素材',
                component: () => import('@/views/wxgzh/basesetting/material/video'),
                meta: { title: '视频素材', icon: 'table' }
              },
            ]
          },
          {
            path: 'user',
            name: '用户分组',
            component: () => import('@/views/wxgzh/basesetting/user'),
            meta: { title: '用户分组', icon: 'table' }
          },
          {
            path: 'diymenu',
            name: '自定义菜单',
            component: () => import('@/views/wxgzh/basesetting/diymenu'),
            meta: { title: '自定义菜单', icon: 'table' }
          },
          {
            path: 'group_message',
            name: '群发消息',
            component: () => import('@/views/wxgzh/basesetting/group_message'),
            meta: { title: '群发消息', icon: 'table' }
          },
          {
            path: 'tpl_message',
            name: '模版消息',
            component: () => import('@/views/wxgzh/basesetting/tpl_message'),
            meta: { title: '模版消息', icon: 'table' }
          },
        ]
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
        name: '会员列表',
        component: () => import('@/views/users/list'),
        meta: { title: '会员列表', icon: 'table' }
      },
      {
        path: 'create',
        name: '创建会员',
        component: () => import('@/views/users/create'),
        meta: { title: '创建会员', icon: 'table' }
      },
      {
        path: 'edit/:id(\\d+)',
        name: '修改会员',
        component: () => import('@/views/users/create'),
        meta: { title: '修改会员', icon: 'table' , activeMenu: '/user/list'},
        hidden: true
      },
      {
        path: 'config',
        name: '会员系统配置',
        component: () => import('@/views/users/config'),
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
      }
    ]
  },
  {
    path: 'github地址',
    component: Layout,
    children: [
      {
        path: 'https://github.com/jh642384854/vue-element-admin-template',
        meta: { title: 'github地址', icon: 'link' }
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
