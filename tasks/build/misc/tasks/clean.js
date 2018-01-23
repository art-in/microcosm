const del = require('del');

const config = require('../../../../config.build');

module.exports = () =>
  del(
    [
      config.src.output.root + '/gulpfile.js',
      config.src.output.root + '/tasks'
    ],
    {force: true}
  );
