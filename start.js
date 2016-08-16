import webpack from 'webpack';
import webpackConfig from './webpack.config.js';
import { spawn } from 'child_process';
import { join } from 'path';

let server;
const serverPath = join(webpackConfig.output.path, webpackConfig.output.filename);
const compiler = webpack(webpackConfig);

function runServer() {
  if (server) {
    server.kill('SIGTERM');
  }

  server = spawn('node', [serverPath]);

  server.stderr.on('data', data => process.stderr.write(data));
  server.stdout.on('data', data => process.stdout.write(data));
}

compiler.watch({ aggregateTimeout: 300 }, (err, stats) => {
  process.stdout.write(`${stats.toString({ colors: true })}\n\n`);
  runServer();
});

process.on('exit', () => {
  if (server) {
    server.kill('SIGTERM');
  }
});
