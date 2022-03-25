const { merge } = require('webpack-merge')
const { config } = require('./webpack.common')

module.exports = merge(config, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        historyApiFallback: true,
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    optimization: {
        minimize: false,
    },
})
