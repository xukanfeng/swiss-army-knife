import Mock from 'mockjs'

function mockInit() {
  Mock.setup({
    timeout: '100-500',
  })

  let interceptors = []

  const files = require.context('./', true, /\.js$/) // 检索的目录、是否检索子目录、匹配文件的正则表达式
  files.keys().forEach(key => {
    if (key === './index.js') return
    interceptors = interceptors.concat(files(key).default)
  })

  interceptors.forEach(item => {
    for (let [interceptor, target] of Object.entries(item)) {
      const [method, path] = interceptor.split(' ')
      Mock.mock(new RegExp(`^${path}/*`), method, target)
    }
  })

  console.log('mock environment has been initialized.')
}

mockInit()