import { join } from 'path';
import webpack from 'webpack';

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
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
  ],
};
