const { merge } = require('webpack-merge')
const { config } = require('./webpack.common')

module.exports = merge(config, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        historyApiFallback: true,
        open: true,
        hot: true,
        port: 3001,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    optimization: {
        minimize: false,
    },
})
