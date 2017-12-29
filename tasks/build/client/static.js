const config = require('../../../config.js');

module.exports = function(gulp) {
    return gulp.src(config.src.client.static + '/**/*')
        .pipe(gulp.dest(config.src.client.output.root));
};