const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const mode = process.env.NODE_ENV || 'development';
const minimize = mode === 'production';
const plugins = [];
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

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
    osjs: 'OSjs',
    jqyery : 'jQuery'
  },
  optimization: {
    minimize,
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new CopyWebpackPlugin([
      'Images/','icon.svg','icon_white.svg'
    ]),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
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
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  node: {
    fs: "empty"
  }
};