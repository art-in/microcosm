const del = require('del');

const buildConfig = require('../../../../config.build');

module.exports = () =>
  del([buildConfig.src.client.output.bundle.path], {force: true});
