const stylelint = require("gulp-stylelint");

module.exports = gulp =>
  gulp
    .src([
      "**/*.css",

      // TODO: remove node_modules from exclude when gulp-stylelint fixes
      //       support of .stylelintignore
      //       https://github.com/olegskl/gulp-stylelint/issues/85
      "!node_modules/**/*"
    ])

    .pipe(
      stylelint({
        reporters: [{ formatter: "string", console: true }],
        failAfterError: true
      })
    );
