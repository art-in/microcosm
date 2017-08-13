/* global require, process */

const gulpRequireTasks = require('gulp-require-tasks');

gulpRequireTasks({
    path: process.cwd() + '/tasks'
});