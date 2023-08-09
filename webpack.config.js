const path = require('path');//импортируем встроенный модуль
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry:'./src/main.js',//точка входа
  output:{//ключ
    filename:'bundle.[contenthash].js',// название
    path: path.resolve(__dirname,'build'),//абсолютный путь где находится
    clean:true,//очищать предыдущую версию
  },
  devtool:'source-map',//карта исходного кода
  plugins:[
    new HtmlPlugin({
      template:'public/index.html',
    }),
     new CopyPlugin({
       patterns:[
        { from: 'public',
      globOptions:{
       ignore:['**/index.html'],
       },
      },
    ],
   },
  ),
],
  module:{
    rules:[
      {
        test:/\.js$/,
        exclude: /(node_modules)/,
        use:{
          loader:'babel-loader',
          options:{
            presets:['@babel/preset-env']
          },
        }
      },
    ],
  },
}
