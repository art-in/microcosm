/* global require, module, __dirname */

const path = require('path');
const gutil = require('gulp-util');
const webpack = require('webpack');

/**
 * Packs client assets into bundle
 * @param {object} opts
 * @return {object} webpack compiler
 */
function pack(opts) {

    const isWatch = opts.isWatch;

    const entries = [];
    const plugins = [];
    const jsLoaders = [];

    if (isWatch) {
        entries.push(
            'webpack-dev-server/client?http://localhost:8080/',
            'webpack/hot/only-dev-server'
        );

        plugins.push(new webpack.HotModuleReplacementPlugin());

        jsLoaders.push('react-hot');
    }

    return webpack({
        devtool: 'eval-source-map',
        entry: entries.concat([
            'babel-polyfill',
            './client/client'
        ]),
        output: {
            path: path.resolve(__dirname, './client/build/'),
            filename: 'bundle.js',
            publicPath: '/build/'
        },
        plugins: [].concat(plugins),
        module: {
            rules: [{
                test: /\.(js|jsx)$/,
                use: [
                    {loader: 'react-hot-loader'},
                    {loader: 'babel-loader'}
                ],
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
            extensions: ['.webpack.js', '.web.js', '.js', '.jsx'],
            modules: [__dirname, 'node_modules']
        }
    }, function(err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack]', stats.toString({
            colors: true,
            chunks: false
        }));
    });
}

module.exports = {
    pack: pack
};