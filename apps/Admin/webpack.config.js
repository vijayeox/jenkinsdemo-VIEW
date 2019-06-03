const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

const mode = process.env.NODE_ENV || "development";
const minimize = mode === "production";
const plugins = [];

if (mode === "production") {
  plugins.push(
    new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: {
        discardComments: true
      }
    })
  );
}

module.exports = {
  mode: mode !== "development" ? "production" : mode,
  devtool: "source-map",
  entry: [
    path.resolve(__dirname, "index.js"),
    path.resolve(__dirname, "index.scss")
  ],
  externals: {
    osjs: "OSjs"
  },
  optimization: {
    minimize
  },
  plugins: [
    new CompressionPlugin(),
    // new BundleAnalyzerPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new CopyWebpackPlugin(["icon.png", "images/"]),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    ...plugins
  ],
  module: {
    rules: [
      {
        test: /\.(svg|png|jpe?g|gif|webp)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              publicPath: "/apps/Admin"
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        include: /typeface/,
        use: {
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]",
            publicPath: "apps/Admin"
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "sass-loader",
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
          loader: "babel-loader",
          options: {
            presets: [
              require.resolve("@babel/preset-react"),
              require.resolve("@babel/preset-env")
            ],
            plugins: [
              require.resolve("@babel/plugin-transform-runtime"),
              [
                require.resolve("@babel/plugin-proposal-class-properties"),
                { loose: false }
              ]
            ]
          }
        }
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      }
    ]
  }
};
