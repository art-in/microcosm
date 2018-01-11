const seq = require('gulp-sequence');

module.exports = (gulp, done) =>
    seq(
        // prebuild server so nodemon does not fail
        // on empty server folder
        'build:server',
        [
            'build:watch',
            'serve:watch'
        ],
        done
    );