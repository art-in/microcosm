const babel = require('gulp-babel');
const config = require('../../../config.build');

module.exports = {
    deps: ['build:server:clean'],
    fn: gulp =>
        gulp.src(config.src.serv.root + '/**/*.js')
            .pipe(babel())
            .pipe(gulp.dest(config.src.serv.output.root))
};