/* global module, require */
const buildConfig = require('./config.build');

module.exports = {
  plugins: [
    require('postcss-import')({path: buildConfig.src.client.root}),
    require('postcss-custom-media'),
    require('postcss-media-minmax'),
    require('postcss-nesting'),
    require('autoprefixer')
  ]
};
