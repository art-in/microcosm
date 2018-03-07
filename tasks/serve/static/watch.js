const buildConfig = require('../../../config.build');
const nodemon = require('gulp-nodemon');

module.exports = () =>
  nodemon({
    script: buildConfig.src.serv.output.entry,
    watch: buildConfig.src.serv.output.root,
    env: {
      NODE_PATH: '$NODE_PATH;' + __dirname
    },

    // delay restart a bit so watched build has time
    // to cleanup and rebuild
    delay: '2500'
  });
