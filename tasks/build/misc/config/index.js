const buildConfig = require('../../../../config.build');

module.exports = {
  deps: ['build:misc:config:clean'],
  fn: gulp =>
    gulp
      .src([
        buildConfig.root + '/config.js',
        buildConfig.root + '/config.user.js'
      ])
      .pipe(gulp.dest(buildConfig.src.output.root))
};
