const spawn = require('child_process').spawn;

const {stdout, stderr} = process;

module.exports = (params, done) => {
  const ps = spawn('node', [require.resolve('sloc/bin/sloc'), ...params]);

  ps.stdout.on('data', data => stdout.write(data.toString()));
  ps.stderr.on('data', data => stderr.write(data.toString()));
  ps.on('exit', done);
};
