const {spawn} = require('child_process');
const buildConfig = require('../../../config.build');

module.exports = {
  deps: ['deploy:docker:build'],
  fn: (gulp, done) => {
    const ps = spawn('docker', [
      'image',
      'push',
      // TODO: push only current and latest version when specifying multiple
      // tags is supported. for now push all versions including previous ones,
      // their 'pushed' date on hub going to be updated which is unfortunate
      // https://github.com/docker/cli/issues/267
      '--all-tags',
      buildConfig.deploy.docker.imageTag
    ]);

    ps.stdout.pipe(process.stdout);
    ps.stderr.pipe(process.stdout);
    ps.on('exit', done);
  }
};
