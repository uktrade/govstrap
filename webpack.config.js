const webpack = require('webpack');
const paths = require('./gulp/paths');
const prod = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: prod ? 'hidden-source-map' : 'cheap-module-source-map',

  entry: {
    app: `${paths.sourceJS}/gallery.js`
  },
  output: {
    path: paths.outputJS,
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['babel-loader']
    }]
  },
  resolve: {
    extensions: ['', '.js'],
    modules: [
      paths.sourceJS,
      paths.libJS,
      'node_modules'
    ]
  },

  plugins: prod ? [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }}),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      },
      sourceMap: false }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.bundle.js'})
  ] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.bundle.js' })
  ]
};
