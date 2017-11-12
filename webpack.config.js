const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

config = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: ['./js/app.js', './js/events.js']
  },
  output: {      
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/scripts/[name].bundle.js'
       
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    compress: true,
    //stats: 'errors-only',
    port: 3000,
    proxy: {
        "/data": "http://localhost:9000"
    },
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['app', 'common'],
      template: './templates/index.pug',
    }),
    new ExtractTextPlugin('assets/styles/[name].bundle.css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'assets/scripts/common.js',
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
        // use: ExtractTextPlugin.extract({
        //   fallback: 'style-loader',
        //   use: "css-loader?sourceMap=true&importLoaders=1,url=false!postcss-loader"
        // }),
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                  minimize: true,
                  sourceMap: true,
                  importLoaders: 1,
                  url: false
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        })),
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
      config.devtool = 'source-map';
      config.plugins = config.plugins.concat([
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          },
          sourceMap: true 
        }),
        //new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': 'production',
        }),
        //new FaviconsWebpackPlugin('./favicon.png')
      ]);
    } 
    return config;
}

