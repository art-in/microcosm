/* global require, module, Promise, __dirname */

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
    if (opts.watch) {
        assert(opts.serv);
        assert(opts.serv.host);
        assert(opts.serv.port);
        assert(opts.serv.public);
    }

    const entries = [];
    const plugins = [];
    const loaders = {js: []};
    const resolveModules = [];

    if (opts.watch) {
        entries.push(
            `webpack-dev-server/client?` +
                `http://${opts.serv.host}:${opts.serv.port}/`,
            'webpack/hot/only-dev-server'
        );

        plugins.push(new webpack.HotModuleReplacementPlugin());

        loaders.js.push('react-hot-loader');
    }

    entries.push('babel-polyfill');

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
                use: loaders.js.concat([
                    {loader: 'babel-loader'}
                ]),
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

    const compiler = webpack(config,
        function(err, stats) {
            if (err) {
                throw new gutil.PluginError('webpack', err);
            }
            gutil.log('[webpack]', stats.toString('minimal'));
            
            resolve();
        });

    if (opts.watch) {

        const server = new WebpackDevServer(compiler, {
            publicPath: '/build/',
            contentBase: opts.serv.public,
            historyApiFallback: true,
            filename: opts.output.name,
            hot: true,
            proxy: {},
            stats: 'minimal'
        });

        server.listen(opts.serv.port, opts.serv.host, function(err) {
            if (err) {
                throw err;
            }

            console.log(
                `Webpack dev server listening at ` +
                `http://${opts.serv.host}:${opts.serv.port}/`);
        });
    }

    return promise;
}

module.exports = {
    getPackConfig,
    pack
};