var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    'bundle': './index.js'
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    chunkFilename: 'chunk/[name].js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: false,
      mangle: false,
      output: {
        comments: false
      },
      compress: {
      properties: false,
        warnings: false
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015'],
          plugins: ['transform-object-rest-spread', 'transform-object-assign', 'transform-remove-strict-mode']
        }
      }
    ]
  }
}