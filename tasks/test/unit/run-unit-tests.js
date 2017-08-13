const assert = require('assert');
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
    
    assert(opts.packConfig);
    assert(opts.entry);

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
            browsers: ['PhantomJS'], // Chrome, PhantomJS
            mochaReporter: {
                showDiff: true
            }

        }, resolve).start();
    });
}

module.exports = runUnitTests;