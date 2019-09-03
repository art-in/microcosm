const path = require('path');
const fs = require('fs');
const assert = require('assert');

const gutil = require('gulp-util');
const webpack = require('webpack');
const table = require('text-table');
const WebpackDevServer = require('webpack-dev-server');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

/**
 * Gets config of packing client assets into bundle
 *
 * Use when only config required without run,
 * eg. when webpack run by other tool, eg. by karma
 *
 * @typedef {object} FileLocation
 * @prop {string} path - file path
 * @prop {string} name - file name
 *
 * @typedef {object} OutputOptions
 * @prop {FileLocation} bundle - webpack bundle + chunks
 *
 * @typedef {object} SecureConnectionOptions
 * @prop {boolean} enabled
 * @prop {string} key - private key file path
 * @prop {string} cert - certificate file path
 *
 * @typedef {object} BackendServerOptions
 * @prop {string} host
 * @prop {number} port
 * @prop {SecureConnectionOptions} secure
 *
 * @typedef {object} DevServerOptions
 * @prop {string} host
 * @prop {number} port
 * @prop {string} folder
 * @prop {BackendServerOptions} backend
 *
 * @typedef {object} Options
 * @prop {string|array}     opts.root - module resolve root path
 * @prop {OutputOptions}    opts.output
 * @prop {boolean}          opts.isProduction - indicates production environment
 * @prop {string}           opts.bundleUrlPath
 * @prop {boolean}          [opts.watch=false] - rebuild on changes
 * @prop {string}           [opts.entry] - entry module path
 * @prop {DevServerOptions} [opts.serv] - dev server
 * @prop {string}           [opts.static] - static files path
 * @prop {boolean}          [opts.coverage] - instrument code coverage counters
 *
 * @param {Options} opts
 *
 * @return {object} config
 */
function getPackConfig(opts) {
  let mode;
  const entries = [];
  const resolveModules = [];
  const plugins = [
    // uncomment to see bundle analysis (starts server + opens browser)
    // new (require('webpack-bundle-analyzer')).BundleAnalyzerPlugin({
    //   analyzerHost: '0.0.0.0',
    //   analyzerPort: 8888
    // }),

    // ensure import paths have correct char case
    // (case is ignored in windows, but respected in linux)
    new CaseSensitivePathsPlugin()
  ];
  const babelPlugins = [];
  let devtool = null;

  if (opts.watch) {
    assert(opts.serv, 'Watch mode needs developer server options');
    babelPlugins.push(require('react-hot-loader/babel'));
  }

  if (opts.isProduction) {
    // 1. minify / tree shake
    // 2. include minified versions of third-party libs (eg. react)
    // 3. use process.env.NODE_ENV in the app for runtime optimizations
    //    (eg. to disable logger/perf store middlewares in prod)
    mode = 'production';

    // do not include source maps
    devtool = false;
  } else {
    mode = 'development';

    // stacktrace source-mapping:
    // - 'eval-source-map':
    //    chrome devtools - all good,
    //    karma - slightly wrong line numbers.
    // - 'source-map':
    //    chrome devtools - all good,
    //    karma - not source-mapped at all.
    // - 'inline-source-map':
    //    chrome devtools - all good,
    //    karma - both source and in-bundle line numbers.
    devtool = 'inline-source-map';
  }

  entries.push('babel-polyfill');

  if (opts.watch) {
    // 'react-hot-loader/patch' should go after 'babel-polyfill'
    entries.push('react-hot-loader/patch');
  }

  if (opts.entry) {
    // entry point not always required (eg. when webpack run by karma)
    entries.push(opts.entry);
  }

  if (opts.coverage) {
    // instrument code with coverage counters (lines/statements/branches execs).
    // eg. for unit test coverage metric.
    babelPlugins.push('istanbul');
  }

  let root = opts.root;
  if (typeof root === 'string') {
    root = [root];
  }
  root.forEach(p => resolveModules.push(path.resolve(__dirname, p)));

  return {
    mode,
    devtool,
    entry: entries,
    output: {
      path: path.resolve(__dirname, opts.output.bundle.path),
      filename: opts.output.bundle.name,

      // URL path from which additional chunks will be requested in case
      // bundle split up on several chunks
      // (eg. if url-loader does not include font into bundle but extract
      // it to separate chunk, this is URL path url-loader will add to
      // URL to request that chunk)
      publicPath: opts.bundleUrlPath
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                // extend '.babelrc' config
                plugins: babelPlugins
              }
            }
          ],
          exclude: [/node_modules/]
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              // wraps currently installed 'css' loader
              // to auto-generate typings for styles
              loader: 'typings-for-css-modules-loader',
              options: {
                // allow default export for typings
                namedExport: true,

                // use camel-case notation of class names in js
                // to be able to type check them, otherwise usage
                // of nonexistent class will be ignored
                // (classes.classA instead of classes['class-a'])
                camelCase: true,

                // use modules to encapsulate view component styles
                modules: true,
                localIdentName: '[name]-[local]',

                // minify css
                minimize: opts.isProduction
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        },
        {
          test: /\.(ttf|otf|eot|svg|woff|woff2)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                // add to bundle in form of base64 data url
                // only if file size is less than limit
                limit: 8192
              }
            }
          ]
        },
        {
          test: /\.enex$/,
          use: [{loader: 'raw-loader'}]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: resolveModules.concat(['node_modules'])
    },
    performance: {
      // ignore any "asset is too big" warnings since we use aggressive caching
      // via service worker cache storage, which solves load performance issues.
      // to improve parse/run performance of js chunks we could still use code
      // splitting. but it requires extra effort for finding split points and
      // then dynamic importing, so it does not worth it for now.
      hints: false
    }
  };
}

/**
 * Packs client assets into bundle
 *
 * @param {Options} opts
 * @return {promise}
 */
function pack(opts) {
  const config = getPackConfig(opts);

  let resolve;

  const promise = new Promise(res => {
    resolve = res;
  });

  if (opts.watch) {
    const {backend} = opts.serv;

    let backendHost = backend.host;
    const backendPort = backend.port;

    if (backendHost === '0.0.0.0') {
      backendHost = 'localhost';
    }

    const scheme = backend.secure.enabled ? 'https' : 'http';
    const backendUrl = `${scheme}://${backendHost}:${backendPort}`;

    // dev server
    // - serves static files without need of backend server
    //   (not using this currently - proxying to backend server instead)
    // - builds src modules into bundle with webpack and serves it from memory
    // - rebuilds bundle on-the-fly when src modules changed
    // - sends module changes to client through HMR plugin
    const devServerConfig = {
      // secure https connection (should reflect backend secure options)
      https: backend.secure.enabled
        ? {
            key: fs.readFileSync(backend.secure.key),
            cert: fs.readFileSync(backend.secure.cert)
          }
        : false,

      // requests to this URL path will be served with in-memory bundle.
      // for some reason it should always start with slash, since
      // output.publicPath cannot start with slash (to allow base url +
      // relative bundle path) - append starting slash inplace
      publicPath: '/' + opts.bundleUrlPath,

      // file system path to serve static files from
      contentBase: opts.serv.folder,

      proxy: {
        // everything except bundle should be served from backend server
        // (eg. because backend injects client config into index.html)
        ['!' + opts.bundleUrlPath + '/**']: {target: backendUrl, secure: false}
      },

      historyApiFallback: true,

      // enable hot module replacement
      hot: true,

      stats: 'minimal',

      // do not spam browser log
      clientLogLevel: 'warning'
    };

    // update config by adding necessary entries and plugins
    WebpackDevServer.addDevServerEntrypoints(config, devServerConfig);
    const compiler = webpack(config);
    const server = new WebpackDevServer(compiler, devServerConfig);

    server.listen(opts.serv.port, opts.serv.host, function(err) {
      if (err) {
        throw err;
      }

      console.log(
        `Webpack dev server started\n` +
          table([
            ['\t proxying static files from backend at', backendUrl],
            [
              '\t listening at',
              `${scheme}://${opts.serv.host}:${opts.serv.port}/`
            ]
          ])
      );
    });
  } else {
    webpack(config).run(function(err, stats) {
      if (err) {
        gutil.log(err);
      } else {
        gutil.log('[webpack]', stats.toString('minimal'));
        resolve();
      }
    });
  }

  return promise;
}

module.exports = {
  getPackConfig,
  pack
};
