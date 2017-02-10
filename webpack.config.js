const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const webpack = require('webpack');

config = {
  context: __dirname + "/src",
  entry: {
    app: ['./js/app.js', './js/events.js']
  },
  output: {
    //publicPath: '',        
    filename: 'assets/scripts/[name].bundle.js',
    path: __dirname + "/dist"    
  },
  devServer: {
    contentBase: __dirname + "/src",
    stats: 'errors-only',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['app', 'commons'],
      template: './templates/index.pug',
    }),
    new ExtractTextPlugin('assets/styles/[name].bundle.css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      filename: "assets/scripts/commons.js",
      minChunks: 2
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader?sourceMap=true&importLoaders=1,url=false!postcss-loader"
        })
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: true
        }
      },
      {test: /\.(svg)$/, use: 'url-loader?limit=65000&mimetype=image/svg+xml&name=images/[name].[ext]'},
      {test: /\.(png)$/, use: 'url-loader?limit=100000&mimetype=image/png&name=images/[name].[ext]'},
      {test: /\.(jpg)$/, use: 'file-loader?name=images/[name].[ext]'},
      {test: /\.(eot|ttf|woff|woff2)$/, use: 'file-loader?name=fonts/[name].[ext]'}
    ]
  }
};

module.exports = function(env) {
    if (env === 'production') {
      config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        sourceMap: true 
      }));
      config.plugins.push(new FaviconsWebpackPlugin('./favicon.png'));
      config.devtool = 'source-map';
    } 
    return config;
}

