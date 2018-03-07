const del = require('del');

const buildConfig = require('../../../../config.build');

module.exports = () =>
  del([buildConfig.src.output.root + '/config*.js'], {force: true});
