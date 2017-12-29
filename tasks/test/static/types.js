const config = require('../../../config.js');
const ts = require('gulp-typescript');

module.exports = {

    // build to make sure typings for css files are auto-generated.
    // this is the cost of not uploading 'css.d.ts' to repository.
    // otherwise type test will fail in clean environment (eg. CI)
    deps: ['build:client:bundle'],

    fn: function() {
        const tsProject = ts.createProject(config.test.static.tsConfig);
    
        // load and check files defined in config
        return tsProject.src()
            .pipe(tsProject())
            
            // exit with error code if type errors found
            // https://github.com/ivogabe/gulp-typescript/issues/295
            .once('error', function() {
                // eslint-disable-next-line no-invalid-this
                this.once('finish', () => process.exit(1));
            })
            .js;
    }
};