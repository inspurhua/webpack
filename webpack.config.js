/**
 * webpack
 * npx webpack-dev-server
 */
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //剥离单独文件
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin"); //压缩
// process.env.NODE_ENV = 'prouction'
//postcss-loader 使用browerslist中的那个环境,
//loader数组从下网上执行
//loader 先执行eslint 在执行babel-loader

const CommonCssLoader = [
  MiniCssExtractPlugin.loader,
  "css-loader",
  {
    loader: "postcss-loader",
    options: {
      ident: "postcss",
      plugins: () => [require("postcss-preset-env")()]
    }
  }
];
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
        use: [...CommonCssLoader, "less-loader"]
      },
      {
        test: /\.css$/,
        use: [...CommonCssLoader]
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        enforce: "pre", //先执行
        options: {
          fix: true
        }
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                useBuiltIns: "usage",
                corejs: {
                  version: 3
                },
                targets: {
                  chrome: "60",
                  firefox: "50",
                  ie: "9"
                }
              }
            ]
          ]
        }
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
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: "css/bundle.css"
    }),
    new OptimizeCssAssetsWebpackPlugin()
  ],
  devServer: {
    contentBase: resolve(__dirname, "dist"),
    compress: true,
    port: 3000,
    open: true
  },
  mode: "production"
};
