import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import LoginLayout from '../layouts/LoginLayout.vue'
import PlaygroundLayout from '../layouts/PlaygroundLayout.vue'

Vue.use(VueRouter)

const routes = [
  // 同一路径可以匹配多个路由时，匹配优先级按定义顺序
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: LoginLayout,
    children: [{
        path: 'login',
        component: () => import('../views/Login.vue')
      },
      {
        path: '',
        component: () => import('../views/Login.vue')
      },
    ]
  },
  {
    path: '/playground',
    component: PlaygroundLayout,
    children: [{
        path: 'puzzlecards',
        component: () => import('../views/PuzzleCards.vue')
        // alias: 'players' 别名
      },
      {
        path: 'players',
        name: 'players', // 命名路由
        component: () => import('../views/Players.vue'),
        children: [{
            path: 'player/:id',
            components: {
              welcome: () => import('../views/Welcome.vue'), // 命名视图
              profile: () => import('../views/PlayerProfile.vue'),
            }
          },
          // 命名视图也可以嵌套
          // ... ...
        ]
      },
      {
        path: 'player/:id', // 动态路由匹配
        // name: "PlayerProfile",
        // [vue-router] Named Route 'PlayerProfile' has a default child route. When navigating to this named route (:to="{name: 'PlayerProfile'"), the default child route will not be rendered. Remove the name from this route and use the name of the default child route for named links instead.
        component: () => import('../views/PlayerProfile.vue'),
        // 使用 props 将组件和路由解耦，从 $router 中获取的参数将从 props 中获取
        // 布尔模式，route.params 将会被设置为组件属性
        props: true,
        // 对象模式
        // props: {data: 'someData'},
        // 函数模式
        // props: route => ({data: route.query.id}),
        beforeEnter: (to, from, next) => {
          console.log('[beforeEnter] 路由独享的守卫')
          next()
        },
        // 路由元信息
        meta: {
          requireAuth: true,
          msg: 'this is the msg in the meta.',
        },
        children: [{
            path: 'profile',
            component: () => import('../views/PlayerProfile.vue')
          },
          {
            path: '', // 默认子路由，处理匹配不到子路由的情况
            component: () => import('../views/Welcome.vue')
          }
        ]
      },
      {
        path: 'miscellanies',
        component: () => import('../views/Miscellanies.vue')
      },
      {
        path: 'chatroom',
        component: () => import('../views/ChatRoom.vue')
      },
      {
        path: '',
        component: () => import('../views/Welcome.vue')
      },
      {
        path: '*',
        component: () => import('../views/Welcome.vue')
      },
    ]
  },
  {
    path: '/*', // 匹配任意路径，含有通配符的路由应该放在最后。使用通配符时，$route.params内会自动添加一个pathMatch参数，可以从$route.params.pathMath来获取被匹配的部分
    name: 'Error404',
    component: () => import('../views/404.vue')
  },
]

const router = new VueRouter({
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  console.log('[router.beforeEach] 全局前置守卫')
  // 处理 meta，可以用来检查是否已经登陆，如果未登陆，则跳转到登陆界面
  to.matched.map(record => {
    record.meta.msg && console.log(record.meta.msg)
  })
  next()
  // 中断当前导航
  // next(false)
  // 跳转到一个不同的地址
  // next('/') or next({path: '/'})
  // 导航终止，并将错误传递给 router.onError 注册过的回调
  // next(new Error())
})

// eslint-disable-next-line no-unused-vars
router.afterEach((to, from) => {
  console.log('[router.afterEach] 全局后置钩子')
})

export default router