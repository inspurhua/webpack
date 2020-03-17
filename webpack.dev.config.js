/**
 * webpack
 * npx webpack-dev-server
 * HMR 热模块替换,只打包变化的模块,提升速度devServer hot true,
 * 开发环境styleloader更快,实现了HMR
 * js文件没有hmr功能,修改js代码,非入口js文件
 * if(module.hot){module.hot.accept('print.js',function(){//坚挺print.js文件的变化,执行print();})}
 * 解决 entry入口该成数组,html也加入
 */
const {resolve} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: ["./src/js/index.js", "./src/index.html"],
  output: {
    filename: "js/bundle.js",
    path: resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: "url-loader",
        options: {
          limit: 8 * 1024,
          name: "[contenthash:10].[ext]",
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
          name: "[contenthash:10].[ext]",
          outputPath: "media"
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ],
  devServer: {
    contentBase: resolve(__dirname, "dist"),
    compress: true,
    port: 3000,
    open: true,
    hot: true
  },
  mode: "development",
  devtool: "source-map"
};

/**
 * devtool参数
 * source-map外部,错误代码准确位置和准确信息
 * inline-source-map:内联,速度快,一个map,错误代码准确位置和准确信息
 * hidden-source-map:外联,错误原因,和构建后的位置,不是源代码的位置
 * eval-source-map:内联,每一个文件一个map,都在eval函数中,错误代码准确位置和准确信息
 * nosources 外部 ,有错误信息,没源代码信息,隐藏源代码
 * cheap 外部 ,错误精确到行,其他精确到列
 * cheap-module 外部
 * -sourc-emap
 * 开发环境:速度快调试友好, eval-source-map
 * 生产环境:隐藏hidden nosources,一定是外部的方式,如果调试用source-map;速度快cheap-module-source-map
 */