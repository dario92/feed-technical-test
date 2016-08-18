import { join } from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

module.exports = {
  entry: join(__dirname, 'src/server.js'),
  output: {
    path: join(__dirname, 'dist'),
    filename: 'server.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
      },
    ],
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
  ],
  target: 'node',
  externals: [nodeExternals()],
};
