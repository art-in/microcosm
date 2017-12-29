const config = require('../../../config');

module.exports = {
    deps: ['build:server'],
    fn: function(gulp) {
        return gulp.watch([
            config.src.serv.root + '/**/*.js'
        ],
        ['build:server']);
    }
};