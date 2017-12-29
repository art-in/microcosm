const config = require('../../../config.js');

module.exports = {
    deps: ['build:client:clean'],
    fn: function(gulp) {
        return gulp.src(config.src.client.static + '/**/*')
            .pipe(gulp.dest(config.src.client.output.root));
    }
};