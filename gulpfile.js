/* global require, __dirname */

const path = require('path');
const gulp = require('gulp');
const WebpackDevServer = require('webpack-dev-server');
const nodemon = require('gulp-nodemon');
const pack = require('./gulpfile.pack.js').pack;

gulp.task('build:watch', ['serv'], function() {
    const compiler = pack({
        isWatch: true
    });
    const server = new WebpackDevServer(compiler, {
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
            NODE_PATH: '$NODE_PATH;' + __dirname
        }
    });
});

gulp.task('build', function() {
    return pack({});
});

gulp.task('default', ['build']);