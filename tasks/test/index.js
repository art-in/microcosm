const seq = require('gulp-sequence');

module.exports = (gulp, done) => seq('test:static', 'test:unit', done);
