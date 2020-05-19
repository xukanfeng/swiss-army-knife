const VConsolePlugin = require('vconsole-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  productionSourceMap: false,
  devServer: {
    // host: '0.0.0.0',
    port: 10001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // pathRewrite: { '^/api' : '' }, // 重写路径，将 axios请求中的 /api 替换为 ''
        secure: false, // 默认情况下不接受运行在https上，且使用了无效证书的后端服务器
        // eslint-disable-next-line no-unused-vars
        bypass: function (req, res, proxyOptions) { // 自定义规则绕过代理
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.')
            return '/index.html'
          }
        },
      },
      '/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    },
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  chainWebpack: config => {
    const entry = config.entry('app')
    if (process.env.NODE_ENV === 'mock') {
      entry.add('./mock').end()
    }
    // https://cli.vuejs.org/zh/guide/webpack.html#%E9%93%BE%E5%BC%8F%E6%93%8D%E4%BD%9C-%E9%AB%98%E7%BA%A7
    config.module
      .rule('ts')
      .test(/\.tsx?$/)
      .exclude
      .add(resolve('node_modules'))
      .end()
      .use('ts-loader')
      .loader('ts-loader')
      .options({
        appendTsSuffixTo: ['\\.vue$']
      })
      .end()
  },
  // configureWebpack可以是一个对象，被 webpack-merge 合并到 webpack 的设置中去
  // 也可以是一个函数，进行逻辑处理
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'test') {
      config.plugins.push(
        new VConsolePlugin({
          enable: true,
        })
      )
    }
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_debugger: true,
              drop_console: true,
            },
          },
          sourceMap: false,
          parallel: true,
        })
      )
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.css$|\.ttf$|\.html$|\.svg$|\.json$|\.js$/,
          threshold: 0, // 只有大小大于该值的资源会被处理
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: true // 删除原文件
        }),
      )
    }
    // 可以返回一个对象，也可以通过 config 对象赋值： config.resolve.alias['vue$'] = ...
    return {
      resolve: {
        alias: {
          vue$: 'vue/dist/vue.esm.js'
        }
      }
    }
  },
}