export default {
  // umi约定存放页面的文件夹是pages，如果改成page，要增加该配置项
  singular: true,
  antd: {},
  dva: {},
  // 配置式路由
  routes: [{
    path: '/',
    component: '../layout', // 相对于page目录的相对路径
    routes: [
      {
        path: '/',
        component: 'HelloWorld'
      },
      {
        path: '/helloworld',
        component: 'HelloWorld'
      },
      {
        path: '/puzzlecards',
        component: 'PuzzleCards'
      },
      {
        path: 'list',
        component: 'list'
      },
      {
        path: '/dashboard',
        routes: [
          { path: '/dashboard/analysis', component: 'Dashboard/Analysis' },
          { path: '/dashboard/monitor', component: 'Dashboard/Monitor' },
          { path: '/dashboard/workplace', component: 'Dashboard/Workplace' },
        ]
      }
    ],
    proxy: {
      // 处理跨域问题。如果请求以/dev开头，就转发到target地址，/dev保留在转发地址中
      '/dev': {
        target: 'https://08ad1pao69.execute-api.us-east-1.amazonaws.com',
        changeOrigin: true,
      },
    },
  }]
}