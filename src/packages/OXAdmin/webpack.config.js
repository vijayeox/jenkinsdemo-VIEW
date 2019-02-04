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
  mode,
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
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    ...plugins
  ],
  module: {
    rules: [
      {
      test: /\.(svg|png|jpe?g|gif|webp)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath : "apps/OXAdmin"
          }
        }
      ]
    },
    {
      test: /\.(eot|ttf|woff|woff2)$/,
      include: /typeface/,
      use: {
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
          publicPath : "apps/OXAdmin"
        }
      }
    },
      {
        test: /\.(sa|sc|c)ss$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/, 
        loader: 'html-loader'
      }
    ]
  }
};
