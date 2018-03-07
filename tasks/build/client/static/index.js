const buildConfig = require('../../../../config.build');

module.exports = {
  deps: ['build:client:static:clean'],
  fn: gulp =>
    gulp
      .src(buildConfig.src.client.static + '/**/*')
      .pipe(gulp.dest(buildConfig.src.client.output.root))
};
