/**
 * webpack
 * npx webpack-dev-server
 * tree shaking
 * js: ,1es6模块,2productionmode
 */
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //剥离单独文件
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin"); //压缩
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
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
      sideEffects:false,
      plugins: () => [require("postcss-preset-env")()]
    }
  }
];
module.exports = {
  entry: {
    index: ["./src/js/index.js", "./src/html/index.html"]//hmr 让html热更新生效
  },
  output: {
    filename: "js/[name].[contenthash:10].js",
    path: resolve(__dirname, "dist"),
    publicPath:"/",
    chunkFilename:'js/[name]_chunk.js'//非入口chunk
    // library:'[name]',
    // librayTarget:'window'//window.[name] = 这个js库,可以是global[nodejs]  commonjs[通过comm导入使用],
  },
  module: {
    rules: [
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
        //oneOf只会匹配一个
        oneOf: [
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
              ],
              cacheDirectory: true
            }
          },

          {
            test: /\.(png|jpg|gif)$/,
            loader: "url-loader",
            options: {
              limit: 8 * 1024,
              name: "[name].[contenthash:10].[ext]",
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
              name: "[name].[contenthash:10].[ext]",
              outputPath: "media"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/html/index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: "css/bundle.[contenthash:10].css"
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    new CleanWebpackPlugin(),
  ],
  devServer: {
    contentBase: resolve(__dirname, "dist"),
    compress: true,
    port: 3000,
    open: true
  },
  mode: "production",
  devtool: "source-map",
  // sideEffects: ["*.css"],
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  externals:{
    //拒绝打包jquery,通过script在html中引入
    jquery:'jQuery'
  }
};
/**
 *  sideEffects不摇晃树的tree shaking 的文件,[在入口js中imort js会不被打包,sideEffects 为false]
  //自动讲node_modules代码打包成一个chunk输出
  //自动分析多入口,独立依赖文件盗宝成一个chunk
 */
