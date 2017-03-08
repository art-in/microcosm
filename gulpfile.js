var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var nodemon = require('gulp-nodemon');

function pack(opts) {
    var isWatch = opts.isWatch;

    var entries = [];
    var plugins = [];
    var jsLoaders = [];

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

gulp.task('build:watch', ['serv'], function() {
    var compiler = pack({
        isWatch: true
    });
    var server = new WebpackDevServer(compiler, {
        publicPath: '/build/',
        contentBase: path.resolve(__dirname, './client/'),
        historyApiFallback: true,
        filename: 'bundle.js',
        hot: true,
        proxy: {
            '/api/*': {
                target: 'http://localhost:3000'
            }
        },
        stats: {
            chunks: false,
            colors: true
        }
    });

    server.listen(8080, 'localhost', function(err) {
        if (err) {
            return console.log(err);
        }

        console.log('Listening at http://localhost:8080/');
    });
});

gulp.task('serv', function() {
    nodemon({
        script: 'app.js',
        env: {
            NODE_PATH: '$NODE_PATH;' + __dirname //eslint-disable-line no-path-concat
        }
    });
});

gulp.task('build', function() {
    return pack({});
});

gulp.task('default', ['build']);