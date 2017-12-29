const config = require('../../../config');

module.exports = {
    fn: function(gulp) {
        return gulp.watch([
            config.src.serv.root + '/**/*.js'
        ],
        ['build:server']);
    }
};