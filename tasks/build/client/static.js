const config = require('../../../config.build');

module.exports = {
    deps: ['build:client:clean'],
    fn: gulp =>
        gulp.src(config.src.client.static + '/**/*')
            .pipe(gulp.dest(config.src.client.output.root))
};