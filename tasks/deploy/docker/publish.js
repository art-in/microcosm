const {spawn} = require('child_process');
const buildConfig = require('../../../config.build');

module.exports = {
  deps: ['deploy:docker:build'],
  fn: (gulp, done) => {
    const ps = spawn('docker', [
      'image',
      'push',
      '--all-tags',
      buildConfig.deploy.docker.imageTag
    ]);

    ps.stdout.pipe(process.stdout);
    ps.stderr.pipe(process.stdout);
    ps.on('exit', done);
  }
};
