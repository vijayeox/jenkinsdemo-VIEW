const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const mode = process.env.NODE_ENV || "development";
const minimize = mode === "production";
const plugins = [];

if (mode === "development") {
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
  resolve: {
    alias: {
      OxzionGUI: path.resolve(__dirname, "../../src/"),
      Templates: path.resolve(__dirname, "src/templates/")
    }
  },
  entry: [
    path.resolve(__dirname, "index.js"),
    path.resolve(__dirname, "index.scss")
  ],
  externals: {
    osjs: "OSjs"
  },
  optimization: {
    minimize: true
  },
  plugins: [
    new CopyWebpackPlugin(["./images/icon.svg", "images/"]),

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
            loader: "file-loader"
          }
        ]
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
            plugins: ["@babel/plugin-syntax-dynamic-import"]
          }
        }
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
      }
    ]
  }
};
