//var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
require('shelljs/global')
var path = require('path');
var webpack = require('webpack');
var webpackDevServer = require("webpack-dev-server");
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var autoprefixer = require('autoprefixer')
var fs = require('fs');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

var HtmlWebpackPlugin = require('html-webpack-plugin');
var srcDir = path.resolve(process.cwd(), 'src');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin

function getEntry() {
  var jsPath = path.resolve(srcDir, 'js');
  var dirs = fs.readdirSync(jsPath);
  var matchs = [],
    files = {};
  dirs.forEach(function(item) {
    matchs = item.match(/(.+)\.js$/);
    if (matchs) {
      files[matchs[1]] = path.resolve(srcDir, 'js', item);
    }
  });
  return files;
}
rm('-rf', "./dist")
var config = {
  devtool: "source-map",
 // sourceMap:true,
  entry: {
    vendor:['jquery'],
    app: srcDir + "/js/main.js"
  },
  output: {
    path: path.join(__dirname, "dist/js/"),
    //publicPath: "dist/js/",
    filename: "[name].[chunkhash:6].js",
    chunkFilename: "[chunkhash].js"
  },
  module: {
    rules: [{
        test: require.resolve('jquery'),
        use: [
          "expose-loader?$",
          "expose-loader?jQuery"
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      },
      {
        test: /\.(css$|styl)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use://"css-loader!postcss-loader!stylus-loader"
           [
             "css-loader",
           {
              loader:"postcss-loader",
              options: {
               sourceMap:true
             }
            },
            {
              loader:"stylus-loader",
              options: {
                importLoaders: 1
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [
    //提供全局的变量，在模块中使用无需用require引入
    new webpack.ProvidePlugin({
      //jQuery: "jquery",
      //$: "jquery",
    }),
    new ExtractTextPlugin("styles.css"),
    //将公共代码抽离出来合并为一个文件
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'] // 指定公共 bundle 的名字。
    }),
    new HtmlWebpackPlugin({
      title: 'My App',
      template: './src/index.html'
    }),
    // new webpack.LoaderOptionsPlugin({
    //   options: {
    //     postcss: require('./webpack-config/vendor/postcss.config.js'),
    //   },
    // })
  ],

}

module.exports = config
