const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require("webpack").container;
const path = require('path');

const paths = {
    src: path.resolve(__dirname, 'src'),
    build: path.resolve(__dirname, 'dist'),
    public: path.resolve(__dirname, 'public'),
}

const config = {
    entry: [
        path.resolve(__dirname, `${paths.src}/index.ts`)
    ],

    output: {
        publicPath: '/',
        path: paths.build,
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
        assetModuleFilename: '[name].[hash][ext]',
        clean: true,
    },

    plugins: [
        new ModuleFederationPlugin({
            name: "host-app",
            remoteType: 'var',
            remotes: {
                testRemoteApp: "testRemoteApp@http://localhost:3002/remoteEntry.js",
            },
            shared: { react: { singleton: true }, "react-dom": { singleton: true } },
        }),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: paths.public,
                    to: 'assets',
                    globOptions: {
                        ignore: ['*.DS_Store'],
                    },
                    noErrorOnMissing: true,
                },
            ],
        }),

        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(`${paths.public}/index.html`),
        }),
    ],

    module: {
        rules: [
            { test: /\.(t|j)sx?$/, use: ['babel-loader'] },
            { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },
            { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },
        ],
    },

    resolve: {
        modules: [paths.src, 'node_modules'],
        extensions: ['.ts', '.js', '.tsx', '.json'],
    },
}

module.exports = {
    config,
    paths
}
