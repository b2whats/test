const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const { name, dependencies } = require('./package.json')

const packageName = name.split('/')[1]

const config = {
  entry: {
    main: './src/index.ts',
    sw: {
      import: './src/worker/service-worker',
      filename: 'service-worker.js',
      chunkLoading: 'import-scripts',
    }
  },

  output: {
    publicPath: 'auto',
    clean: true,
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: 'single'
  },

  plugins: [
    new webpack.container.ModuleFederationPlugin({
      name,
      filename: 'remoteEntry.js',
      remoteType: 'window',
      remotes: {
        '@rb-mf/web-wlb-remote': '@rb-mf/web-wlb-remote',
      },
      shared: {
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
      template: 'public/index.html',
      inject: 'body',
      publicPath: `/mf/${packageName}/`,
      excludeChunks: ['sw'],
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
    alias: {
      '@shared': '/src/shared'
    },
    extensions: ['.ts', '.js', '.tsx', '.json'],
  },
}

module.exports = {
  config
}