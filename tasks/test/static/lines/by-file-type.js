const buildConfig = require('../../../../config.build');
const spawnSloc = require('./spawn-sloc');

module.exports = (gulp, done) => {
  spawnSloc(
    [
      buildConfig.src.root,
      buildConfig.test.root,
      buildConfig.tasks.root,
      '--format',
      'cli-table',
      '--keys',
      'total,source,comment,empty,todo'
    ],
    done
  );
};
