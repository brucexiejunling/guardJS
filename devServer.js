'use strict';

var path = require('path');
var express = require('express');
var webpack = require('webpack');

var app = express();
var config = require('./webpack.config.js');

config.entry = {
  bundle: ['webpack-hot-middleware/client',  './index.js']
};

config.externals = {}

config.plugins = [new webpack.HotModuleReplacementPlugin()];
var compiler = webpack(config);

app.use(express.static(path.join(__dirname, '/')));

app.use(
  require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: '/'
  })
);

app.use(require('webpack-hot-middleware')(compiler));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'test/index.html'));
});

app.listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});