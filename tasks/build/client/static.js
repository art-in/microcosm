const config = require('../../../config.build');
const filter = require('gulp-filter');
const replace = require('gulp-replace');

module.exports = {
    deps: ['build:client:clean'],
    fn: gulp => {

        const indexPageFilter = filter(['**/index.html'], {
            restore: true
        });

        return gulp.src(config.src.client.static + '/**/*')
            
            .pipe(indexPageFilter)
            .pipe(replace('#BASE_URL#', config.src.client.baseUrl))
            .pipe(indexPageFilter.restore)

            .pipe(gulp.dest(config.src.client.output.root));
    }
};