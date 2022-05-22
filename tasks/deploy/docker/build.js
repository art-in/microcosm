const {spawn} = require('child_process');
const assert = require('assert');
const buildConfig = require('../../../config.build');
// @ts-ignore
const pkg = require('../../../package.json');

module.exports = {
  deps: ['build'],
  fn: (gulp, done) => {
    assert(
      buildConfig.deploy.docker.imageTag,
      'deploy.docker.imageTag is not specified in build config'
    );

    const ps = spawn('docker', [
      'build',
      '--tag',
      `${buildConfig.deploy.docker.imageTag}:latest`,
      '--tag',
      `${buildConfig.deploy.docker.imageTag}:${pkg.version}`,
      '--file',
      buildConfig.deploy.docker.dockerFilePath,
      buildConfig.src.output.root
    ]);

    ps.stdout.pipe(process.stdout);
    ps.stderr.pipe(process.stdout);
    ps.on('exit', done);
  }
};
