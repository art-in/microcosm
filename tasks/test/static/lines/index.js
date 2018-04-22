const seq = require('gulp-sequence');

module.exports = (gulp, done) =>
  seq('test:static:lines:by-file-type', 'test:static:lines:summary', done);
