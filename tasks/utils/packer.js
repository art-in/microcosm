const path = require('path');
const gutil = require('gulp-util');
const webpack = require('webpack');
const assert = require('assert');
const WebpackDevServer = require('webpack-dev-server');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

/**
 * Gets config of packing client assets into bundle
 *
 * Use when only config required without run,
 * eg. when webpack run by other tool, eg. by karma
 *
 * @typedef {object} OutputOptions
 * @prop {string} path - output bundle path
 * @prop {string} name - output bundle name
 * 
 * @typedef {object} DevServerOptions
 * @prop {string} host
 * @prop {number} port
 * @prop {string} folder
 * 
 * @typedef {object} Options
 * @prop {string|array}     opts.root - module resolve root path
 * @prop {OutputOptions}    opts.output
 * @prop {boolean}          opts.isProduction - indicates production environment
 * @prop {string}           opts.bundleUrlPath
 * @prop {boolean}          [opts.watch=false] - rebuild on changes
 * @prop {string}           [opts.entry] - entry module path
 * @prop {DevServerOptions} [opts.serv] - dev server
 * 
 * @param {Options} opts
 *
 * @return {object} config
 */
function getPackConfig(opts) {
    
    if (opts.watch) {
        assert(opts.serv);
        assert(opts.serv.host);
        assert(opts.serv.port);
        assert(opts.serv.folder);
    }

    const entries = [];
    const resolveModules = [];
    const plugins = [
        new CaseSensitivePathsPlugin()
    ];
    const babelPlugins = [];

    if (opts.watch) {
        entries.push(
            `webpack-dev-server/client?` +
                `http://${opts.serv.host}:${opts.serv.port}/`,
            'webpack/hot/dev-server'
        );

        plugins.push(new webpack.NamedModulesPlugin());
        plugins.push(new webpack.HotModuleReplacementPlugin());

        babelPlugins.push(require('react-hot-loader/babel'));
    }

    if (opts.isProduction) {
        plugins.push(new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': `'production'`
            }
        }));
    }

    entries.push('babel-polyfill');

    if (opts.watch) {

        // 'react-hot-loader/patch' should go after 'babel-polyfill'
        entries.push('react-hot-loader/patch');
    }

    if (opts.entry) {
        // entry point not always required
        // (eg. when webpack run by karma)
        entries.push(opts.entry);
    }

    let root = opts.root;
    if (typeof root === 'string') {
        root = [root];
    }
    root.forEach(p => resolveModules.push(path.resolve(__dirname, p)));
    
    return {
        // eval-source-map gives stacktraces without source file:line
        // (when stacktrace passed from chrome/phantomjs to terminal by karma)
        devtool: 'inline-source-map',
        entry: entries,
        output: {
            path: path.resolve(__dirname, opts.output.path),
            filename: opts.output.name,

            // URL path from which additional chunks will be requested in case
            // bundle split up on several chunks
            // (eg. if url-loader does not inlude font into bundle but extract
            // it to separate chunk, this is URL path url-loader will add to
            // URL to request that chunk)
            publicPath: opts.bundleUrlPath
        },
        plugins,
        module: {
            rules: [{
                test: /\.(js|jsx)$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        // extend '.babelrc' config
                        plugins: babelPlugins
                    }
                }],
                exclude: [/node_modules/]
            }, {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    // wraps currently installed 'css' loader
                    // to auto-generate typings for styles
                    loader: 'typings-for-css-modules-loader',
                    options: {

                        // allow default export for typings
                        namedExport: true,

                        // use camel-case notation of class names in js
                        // to be able to type check them, otherwise usage
                        // of unexisting class will be ignored
                        // (classes.classA instead of classes['class-a'])
                        camelCase: true,

                        // use modules to incapsulate view component styles
                        modules: true,
                        localIdentName: '[name]-[local]'
                    }
                }, {
                    loader: 'postcss-loader'
                }]
            }, {
                test: /\.(ttf|otf|eot|svg|woff|woff2)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        // add to bundle in form of base64 data url
                        // only if file size is less than limit
                        limit: 8192
                    }
                }]
            }]
        },
        resolve: {
            extensions: ['.js', '.jsx'],
            modules: resolveModules.concat(['node_modules'])
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

    const compiler = webpack(config);

    if (opts.watch) {

        // dev server 
        // - serves static files without need of backend server
        // - builds src modules into in-memory bundle 
        // - rebuilds bundle on-the-fly when src modules changed
        const server = new WebpackDevServer(compiler, {

            // requests to this URL path will be
            // served with in-memory bundle
            publicPath: opts.bundleUrlPath,

            // file system path to serve static files from
            contentBase: opts.serv.folder,
            
            historyApiFallback: true,

            // enable hot module replacement
            hot: true,
            
            stats: 'minimal',

            // do not spam browser log
            clientLogLevel: 'warning'
        });

        server.listen(opts.serv.port, opts.serv.host, function(err) {
            if (err) {
                throw err;
            }

            gutil.log(gutil.colors.bgRed(
                `Webpack dev server listening at ` +
                `http://${opts.serv.host}:${opts.serv.port}/`));
        });
    } else {

        compiler.run(function(err, stats) {
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