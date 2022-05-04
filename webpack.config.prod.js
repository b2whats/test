const { merge } = require('webpack-merge')
const { config } = require('./webpack.common')
const { ESBuildMinifyPlugin } = require('esbuild-loader')


module.exports = merge(config, {
  mode: 'production',
  devtool: false,
  // optimization: {
  //     minimizer: [
  //         new ESBuildMinifyPlugin({
  //             target: 'es2015'
  //         })
  //     ]
  // },
  optimization: {
    minimize: false,
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  stats: {
    children: true
  }
})
