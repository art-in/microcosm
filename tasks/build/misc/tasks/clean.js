const del = require('del');

const buildConfig = require('../../../../config.build');

module.exports = () =>
  del(
    [
      buildConfig.src.output.root + '/gulpfile.js',
      buildConfig.src.output.root + '/tasks'
    ],
    {force: true}
  );
