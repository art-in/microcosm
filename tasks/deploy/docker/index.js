const seq = require('gulp-sequence');

module.exports = (gulp, done) => seq('test', 'deploy:docker:publish', done);
