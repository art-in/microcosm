const config = require('../../config');
const nodemon = require('gulp-nodemon');

module.exports = function() {
    return nodemon({
        script: config.src.serv.entry,
        watch: config.src.serv.root,
        env: {
            NODE_PATH: '$NODE_PATH;' + __dirname
        }
    });
};