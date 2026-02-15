const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../xampp/htdocs/ezop/ezop-react')
    // publicPath: '/ezop-react/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  stats: {
    children: false,
    builtAt: false,
    assetsSort: '!size',
    entrypoints: false,
    hash: false,
    modules: false,
    version: false,
    timings: false
  },
  plugins: [
    // new CleanWebpackPlugin(),
    // new HtmlWebpackPlugin({
    //   template: './src/index.html'
    // })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          '@teamsupercell/typings-for-css-modules-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[folder]__[local]--[hash:base64:5]'
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              prependData: `
                @import "src/style/_colors.scss";
              `
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(js|ts)x?$/,
        use: ['babel-loader'],
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.svg$/,
        use: ['svg-react-loader']
      }
    ]
  }
};
