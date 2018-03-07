const del = require('del');

const buildConfig = require('../../../config.build');

module.exports = () =>
  del([buildConfig.src.serv.output.root + '/**/*'], {force: true});
