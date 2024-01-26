import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: 'index'
    },
    {
      path: '/index',
      name: 'Index',
      component: () => import('./views/Index.vue'),
      meta: { title: '首页' },
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('./views/Home/Home'),
          meta: { title: '首页' }
        },
        {
          path: '/userList',
          name: 'users',
          component: () => import('./views/User'),
          meta: { title: '用户列表' }
        },
        {
          path: '/menuList',
          name: 'menus',
          component: () => import('./views/Menu'),
          meta: { title: '菜单列表' }
        },
        {
          path: '/roleList',
          name: 'roles',
          component: () => import('./views/Role'),
          meta: { title: '角色列表' }
        },
        {
          path: '/staff',
          name: 'staff',
          component: () => import('./views/Staff'),
          meta: { title: '用户信息' }
        },
        {
          path: '/listuser',
          name: 'listuser',
          component: () => import('./views/ListUser'),
          meta: { title: '信息列表' }
        },
        {
          path: '/categoryList',
          name: 'categoryList',
          component: () => import('./views/novel/CategoryList'),
          meta: { title: '分类列表' }
        },
        {
          path: '/novelList',
          name: 'novelList',
          component: () => import('./views/novel/NovelList'),
          meta: { title: '小说列表' }
        },
        {
          path: '/Infoshow',
          name: 'Infoshow',
          component: () => import('./views/information/InfoShow'),
          meta: { title: '个人信息' }
        },
        {
          path: '/editor',
          name: 'editor',
          component: () => import('./views/information/Editor'),
          meta: { title: '富文本编辑器' }
        },
        {
          path: '/markdown',
          name: 'markdown',
          component: () => import('./views/information/Markdown'),
          meta: { title: 'Markdown编辑器' }
        },
        {
          path: '/showFundArticle',
          name: 'showFundArticle',
          component: () =>
            import('./views/information/article/ShowFundArticle'),
          meta: { title: '文章列表' }
        },
        {
          path: '/chinaTouziList',
          name: 'chinaTouziList',
          component: () => import('./views/Investment/ChinaTouziList'),
          meta: { title: '省份投资' }
        },
        {
          path: '/chinaTabsList',
          name: 'ChinaTabsList',
          component: () => import('./views/Investment/ChinaTabsList'),
          meta: { title: '区域投资' }
        },
        {
          path: '/fundPosition',
          name: 'fundPosition',
          component: () => import('./views/capitalData/FundPosition'),
          meta: { title: '投资分布' }
        },
        {
          path: '/maplist',
          name: 'maplist',
          component: () => import('./views/MapList'),
          meta: { title: '地图展示' }
        }
      ]
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/register/Register')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/logo/Login')
    },
    {
      path: '/lock',
      name: 'lock',
      component: () => import('./views/Lock.vue')
    },
    {
      path: '*',
      name: 'Nofind',
      component: () => import('./views/404')
    }
  ]
  // mode: "history"
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = !!localStorage.token

  if (to.path === '/login' || to.path === '/register') {
    next()
  } else {
    isLogin ? next() : next('/login')
  }
})

export default router
