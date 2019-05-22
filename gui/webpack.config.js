const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const mode = process.env.NODE_ENV || "development";
const minimize = mode === "production";
const plugins = [];
const pkg = require("./package.json");
const libraryName = pkg.name;

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
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "GridTemplate.js",
    library: libraryName,
    libraryTarget: "umd",
    publicPath: "/dist/",
    umdNamedDefine: true
  },
  mode,
  devtool: "source-map",
  entry: [path.resolve(__dirname, "index.js")],
  externals: {
    osjs: "OSjs"
    // "react-icons/fa": "react-icons",
    // "react" : "react",
    // "react-dom" : "react-dom",
    // "jquery": "jquery",
    // "sweetalert2":"sweetalert2",
    // "react-dom/server":"react-dom"
  },
  optimization: {
    minimize
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    ...plugins
  ],
  resolve: {
    alias: {
      "react-icons": path.resolve(__dirname, "./node_modules/react-icons")
    }
  },
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
        test: /\.(eot|ttf|woff|woff2)$/,
        include: /typeface/,
        use: {
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]"
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
          loader: "babel-loader"
        }
      }
    ]
  }
};
