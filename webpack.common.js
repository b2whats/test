const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container
const { dependencies } = require('./package.json')

const config = {
    entry: './src/index.ts',

    output: {
        publicPath: 'auto',
        clean: true,
    },

    plugins: [
        new ModuleFederationPlugin({
            name: 'host',
            filename: 'remoteEntry.js',
            remoteType: 'var',
            remotes: {
                testRemoteApp: 'testRemoteApp',
            },
            shared: {
                ...dependencies,
                react: {
                    singleton: true,
                    eager: true,
                    requiredVersion: dependencies.react
                },
                'react-dom': {
                    singleton: true,
                    eager: true,
                    requiredVersion: dependencies['react-dom']
                }
            },
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public',
                    to: 'assets',
                    globOptions: {
                        gitignore: true,
                        ignore: ['**/index.html'],
                    },
                    noErrorOnMissing: true,
                },
            ],
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.html'
        }),
    ],

    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/,
                loader: 'esbuild-loader',
                exclude: /node_modules/,
                options: {
                    loader: 'tsx',
                    target: 'es2015'
                }
            },
            { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },
            { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },
        ],
    },

    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.json'],
    },
}

module.exports = {
    config
}
