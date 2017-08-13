const eslint = require('gulp-eslint');

module.exports = function(gulp) {
    return gulp.src(['**/*.js', '**/*.jsx'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};