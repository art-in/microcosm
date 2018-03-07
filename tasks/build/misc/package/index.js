const buildConfig = require('../../../../config.build');
const replace = require('gulp-replace');

module.exports = {
  deps: ['build:misc:package:clean'],
  fn: gulp =>
    gulp
      .src([buildConfig.root + '/package*.json'])

      // copy only scripts available in build
      .pipe(
        replace(/"scripts":[\S\s]*?}/, '"scripts": {"serve": "gulp serve"}')
      )

      .pipe(gulp.dest(buildConfig.src.output.root))
};
