const Dotenv = require('dotenv-webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const minimize = mode === 'production';
const plugins = [];

if (mode === 'production') {
  plugins.push(new OptimizeCSSAssetsPlugin({
    cssProcessorOptions: {
      discardComments: true
    },
  }));
}

module.exports = {
  mode: (mode !== 'development' ? 'production' : mode),
  devtool: 'source-map',
  entry: [
    path.resolve(__dirname, 'index.js'),
    path.resolve(__dirname, 'index.scss')
  ],
  externals: {
    osjs: 'OSjs'
  },
  optimization: {
    minimize,
  },
  plugins: [
    new CopyWebpackPlugin([
      'icon.svg',
      'icon_white.svg',
      'close.svg'
    ]),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new Dotenv({
      path: './.env',
      safe: true
    }),
    ...plugins
  ],
  module: {
    rules: [{
        test: /\.(sa|sc|c)ss$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              minimize,
              sourceMap: true
            }
          },
        ]
      },
      {
        test: /\.(svg|png|jpe?g|gif|webp)$/,
        use: [{
          loader: 'file-loader'
        }]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};