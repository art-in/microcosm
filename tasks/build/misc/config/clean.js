const del = require('del');

const config = require('../../../../config.build');

module.exports = () =>
  del([config.src.output.root + '/config.serve*.js'], {force: true});
