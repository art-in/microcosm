const babel = require('gulp-babel');
const buildConfig = require('../../../config.build');

module.exports = {
  deps: ['build:server:clean'],
  fn: gulp =>
    gulp
      .src(buildConfig.src.serv.root + '/**/*.js')
      .pipe(babel())
      .pipe(gulp.dest(buildConfig.src.serv.output.root))
};
