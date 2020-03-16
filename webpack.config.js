/**
 * webpack
 * npx webpack-dev-server
 */
const {resolve} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const  MiniCssExtractPlugin= require('mini-css-extract-plugin')
const  OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
// process.env.NODE_ENV = 'development'
module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "js/bundle.js",
    path: resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: () => [require("postcss-preset-env")()]
            }
          },
          "less-loader"
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: () => [require("postcss-preset-env")()]
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: "url-loader",
        options: {
          limit: 8 * 1024,
          name: "[hash:10].[ext]",
          esModule: false,
          outputPath: "images"
        }
      },
      {
        test: /\.html/,
        loader: "html-loader"
      },
      {
        exclude: /\.(html|css|js|less|jpg|png|gif)/,
        loader: "file-loader",
        options: {
          name: "[hash:10].[ext]",
          outputPath: "media"
        }
      },
      {
        test:/\.js$/,
        exclude:/node_modules/,
        loader:'eslint-loader',
        options:{}
      },
      {
        test:/\.js$/,
        exclude:/node_modules/,
        loader:'babel-loader',
        options:{
          presets:['@babel/preset-env']
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "css/bundle.css"
    }),
    new OptimizeCssAssetsWebpackPlugin( )
  ],
  devServer: {
    contentBase: resolve(__dirname, "dist"),
    compress: true,
    port: 3000,
    open: true
  },
  mode: "development"
};