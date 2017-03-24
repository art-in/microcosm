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
 * @param {string} root - module resolve root path
 * @param {object}  opts.output
 * @param {string} opts.output.path - output bundle path
 * @param {string} opts.output.name - output bundle name
 * @param {boolean} [opts.watch=false] - rebuild on changes
 * @param {string}  [opts.entry] - entry module path
 * @param {object}  [opts.serv] - dev server
 * @param {string}  [opts.serv.host]
 * @param {string}  [opts.serv.port]
 *
 * @return {object} config
 */
function getPackConfig(opts) {
    
    assert(opts.root);
    assert(opts.output);
    if (opts.watch) {
        assert(opts.serv);
    }

    const entries = [];
    const plugins = [];
    const loaders = {js: []};

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

    return {
        devtool: 'eval-source-map',
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
            modules: [path.join(__dirname, opts.root), 'node_modules']
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
            gutil.log('[webpack]', stats.toString({
                colors: true,
                chunks: false
            }));
            
            resolve();
        });

    if (opts.watch) {

        const server = new WebpackDevServer(compiler, {
            publicPath: '/build/',
            contentBase: path.resolve(__dirname, opts.output.path),
            historyApiFallback: true,
            filename: opts.output.name,
            hot: true,
            proxy: {},
            stats: {
                chunks: false,
                colors: true
            }
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