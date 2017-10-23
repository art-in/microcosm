const path = require('path');
const gutil = require('gulp-util');
const webpack = require('webpack');
const assert = require('assert');
const WebpackDevServer = require('webpack-dev-server');

/**
 * Gets config of packing client assets into bundle
 *
 * Use when only config required without run,
 * eg. when webpack run by other tool, eg. by karma
 *
 * @param {object} opts
 * @param {string|array} root - module resolve root path
 * @param {object}  opts.output
 * @param {string} opts.output.path - output bundle path
 * @param {string} opts.output.name - output bundle name
 * @param {boolean} opts.isProduction - indicates production environment
 * @param {boolean} [opts.watch=false] - rebuild on changes
 * @param {string}  [opts.entry] - entry module path
 * @param {object}  [opts.serv] - dev server
 * @param {string}  [opts.serv.host]
 * @param {string}  [opts.serv.port]
 * @param {string}  [opts.serv.public]
 *
 * @return {object} config
 */
function getPackConfig(opts) {
    
    assert(opts.root);
    assert(opts.output);
    assert(opts.isProduction !== undefined);
    if (opts.watch) {
        assert(opts.serv);
        assert(opts.serv.host);
        assert(opts.serv.port);
        assert(opts.serv.public);
    }

    const entries = [];
    const plugins = [];
    const resolveModules = [];

    if (opts.watch) {
        entries.push(
            `webpack-dev-server/client?` +
                `http://${opts.serv.host}:${opts.serv.port}/`,
            'webpack/hot/dev-server'
        );

        plugins.push(new webpack.NamedModulesPlugin());
        plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    if (opts.isProduction) {
        plugins.push(new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': `'production'`
            }
        }));
    }

    entries.push('babel-polyfill');
    entries.push('react-hot-loader/patch');

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
            publicPath: '/build/'
        },
        plugins: [].concat(plugins),
        module: {
            rules: [{
                test: /\.(js|jsx)$/,
                use: [{
                    loader: 'babel-loader'
                }],
                exclude: [/node_modules/]
            }, {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        localIdentName: '[name]-[local]'
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
 * @param {object} opts
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
            publicPath: '/build/',

            // file system path to serve static files from
            contentBase: opts.serv.public,
            
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
            if (err || stats.hasErrors()) {
                throw new gutil.PluginError('webpack', err);
            }
            gutil.log('[webpack]', stats.toString('minimal'));
            
            resolve();
        });
    }

    return promise;
}

module.exports = {
    getPackConfig,
    pack
};