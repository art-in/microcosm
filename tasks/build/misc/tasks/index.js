const buildConfig = require('../../../../config.build');

module.exports = {
  deps: ['build:misc:tasks:clean'],
  fn: gulp =>
    gulp
      .src(
        [
          buildConfig.root + '/gulpfile.js',
          buildConfig.root + '/tasks/serve/**/*',
          buildConfig.root + '/tasks/utils/join-path.js',

          // do not copy watch tasks to build
          '!' + buildConfig.root + '/tasks/serve/**/watch.js'
        ],
        {base: buildConfig.root}
      )
      .pipe(gulp.dest(buildConfig.src.output.root))
};
