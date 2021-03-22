var path = require('path')
var webpack = require('webpack')
var pkg = require('./package.json')
var banner = pkg.name + ' v' + pkg.version

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: process.argv.indexOf('-p') !== -1 ? '[name].min.js' : '[name].js',
    library: '[name]'
  },
  externals: {
    lodash: '_'
  },
  plugins: [new webpack.BannerPlugin(banner)],
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }]
  }
}
