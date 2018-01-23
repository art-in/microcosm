const config = require("../../../../config.build");

module.exports = {
  deps: ["build:misc:tasks:clean"],
  fn: gulp =>
    gulp
      .src(
        [
          config.root + "/gulpfile.js",
          config.root + "/tasks/serve/**/*",

          // do not copy watch tasks to build
          "!" + config.root + "/tasks/serve/**/watch.js"
        ],
        { base: config.root }
      )
      .pipe(gulp.dest(config.src.output.root))
};
