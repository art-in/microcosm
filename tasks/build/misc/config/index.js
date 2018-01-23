const config = require('../../../../config.build');

module.exports = {
  deps: ['build:misc:config:clean'],
  fn: gulp =>
    gulp
      .src([config.root + '/config.serve*.js'])
      .pipe(gulp.dest(config.src.output.root))
};
