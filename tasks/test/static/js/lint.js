const eslint = require("gulp-eslint");

module.exports = gulp =>
  gulp
    .src(["**/*.js", "**/*.jsx"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
