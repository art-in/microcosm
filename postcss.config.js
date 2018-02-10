/* global module, require */
const config = require('./config.build');

module.exports = {
  plugins: [
    require('postcss-import')({path: config.src.client.root}),
    require('postcss-custom-media'),
    require('postcss-media-minmax'),
    require('autoprefixer')
  ]
};
