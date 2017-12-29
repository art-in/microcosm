const seq = require('gulp-sequence');

module.exports = {
    fn: (gulp, done) =>
        seq(
            'test:static',
            'test:unit',
            done
        )
};