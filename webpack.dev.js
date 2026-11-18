const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const outputPath = path.win32.resolve('C:\\xampp\\htdocs\\ezop\\ezop-react');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: outputPath,
    writeToDisk: true
  }
});
