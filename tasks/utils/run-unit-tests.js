const KarmaServer = require('karma').Server;

/**
 * Runs unit tests
 *
 * TODO: update karma to v2.0 when sourcemaps loading is fixed
 *       https://github.com/karma-runner/karma/issues/2930
 *
 * @param {object} opts
 * @param {object} opts.packConfig - webpack config
 * @param {string} opts.entry - entry module path
 * @param {boolean} [opts.watch=false] - rerun on file changes
 * @param {boolean} [opts.reportCoverage=false] - generate coverage report
 * @return {Promise}
 */
function runUnitTests(opts) {
  return new Promise(function(resolve) {
    let chrome = 'ChromeHeadlessNoSandbox';

    if (require('os').platform() === 'win32') {
      // TODO: karma cannot capture headless chrome in windows 7,
      // use windowed mode for now #54
      // https://github.com/karma-runner/karma/issues/2652
      chrome = 'Chrome';
    }

    const reporters = [];
    if (opts.reportCoverage) {
      reporters.push('coverage-istanbul');
    }

    new KarmaServer(
      {
        files: [{pattern: opts.entry, watched: true}],

        singleRun: !opts.watch,

        preprocessors: {
          [opts.entry]: ['webpack', 'sourcemap']
        },

        webpack: opts.packConfig,
        webpackMiddleware: {
          stats: 'errors-only'
        },

        customLaunchers: {
          // chrome does not support running as root without --no-sandbox
          ChromeHeadlessNoSandbox: {
            base: 'ChromeHeadless',
            flags: ['--no-sandbox']
          }
        },

        browsers: [chrome],

        frameworks: ['mocha'],
        reporters: ['mocha'].concat(reporters),
        mochaReporter: {
          showDiff: true
        },
        coverageIstanbulReporter: {
          dir: '.coverage',
          fixWebpackSourcePaths: true,
          reports: ['html']
        },

        client: {
          mocha: {
            // test execution timeout (default: 2s)
            // extend for slow CI
            timeout: 5000
          }
        }
      },
      exitCode => {
        // exit with error code if tests fail
        if (exitCode !== 0) {
          process.exit(1);
        } else {
          resolve();
        }
      }
    ).start();
  });
}

module.exports = runUnitTests;
