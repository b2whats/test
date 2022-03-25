const { merge } = require('webpack-merge')
const { config } = require('./webpack.common')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

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
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            async: true,
            typescript: {
                mode: 'write-references',
                configOverwrite: {
                    incremental: true,
                    noEmit: true,
                },
                diagnosticOptions: {
                    semantic: true,
                    syntactic: true,
                }
            }
        }),
    ]
})
