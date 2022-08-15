const { merge } = require('webpack-merge')
const { config } = require('./webpack.common')
const { responseInterceptor } = require('http-proxy-middleware')
const { name, dependencies } = require('./package.json')

const packageName = name.split('/')[1]

module.exports = merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    hot: false,
    port: 3000,
    headers: (req, res) => {
      if (req.url.includes('service-worker')) {
        res.setHeader('service-worker-allowed', '/')
      }
      res.setHeader('Access-Control-Allow-Origin', '*')
    },
    proxy: {
      [`/mf/${packageName}/service-worker.js`]: {
        target: 'http://localhost:3000',
        pathRewrite: { '^/mf/.*/': '/' },
      },
      [`/mf/${packageName}/`]: {
        target: 'http://localhost:3000',
        pathRewrite: { '^/mf/.*/': '/' },
      },
      '/mf/**/**': {
        target: 'http://localhost:3001',
        pathRewrite: { '^/mf/.*/.*/': '/' },
        // onProxyRes: response => {
        //   response.headers['access-control-allow-origin'] = 'http://localhost:8000'
        // },
      },
      '/oauth2': {
        target: 'https://ift-ibrb1-sharing.vtb.ru',
        cookieDomainRewrite: '',
        secure: false,
        onProxyRes: response => {
          response.headers['access-control-allow-origin'] = '*'
        },
      },
    },
    client: {
      logging: 'verbose',
    },
  },
  optimization: {
    minimize: false,
  },
})
