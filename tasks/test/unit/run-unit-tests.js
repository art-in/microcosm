const KarmaServer = require('karma').Server;

/**
 * Runs unit tests
 *
 * @param {object} opts
 * @param {object} opts.packConfig - webpack config
 * @param {string} opts.entry - entry module path
 * @param {boolean} [opts.watch=false] - rerun on file changes
 * @return {Promise}
 */
function runUnitTests(opts) {

    let chrome = 'ChromeHeadless';

    if (require('os').platform() === 'win32') {
        // TODO: karma cannot capture headless chrome
        // in windows 7, use windowed mode for now #54
        chrome = 'Chrome';
    }

    return new Promise(function(resolve) {
        new KarmaServer({
            files: [
                {pattern: 'node_modules/babel-polyfill/dist/polyfill.js'},
                {pattern: opts.entry, watched: true}
            ],
            
            singleRun: !opts.watch,

            preprocessors: {
                [opts.entry]: ['webpack', 'sourcemap']
            },

            webpack: opts.packConfig,
            webpackMiddleware: {
                stats: 'errors-only'
            },

            frameworks: ['mocha'],
            reporters: ['mocha'],
            browsers: [chrome],
            mochaReporter: {
                showDiff: true
            },

            client: {
                mocha: {
                    timeout: 2000
                }
            }

        }, exitCode => {
            
            // exit with error code if tests fail
            if (exitCode !== 0) {
                process.exit(1);
            } else {
                resolve();
            }
        }).start();
    });
}

module.exports = runUnitTests;