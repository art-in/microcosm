const config = require('../config.js');
const nodemon = require('gulp-nodemon');

module.exports = {
    deps: ['build'],
    fn: function() {
        return nodemon({
            script: config.src.serv.entry,
            watch: config.src.serv.root,
            env: {
                NODE_PATH: '$NODE_PATH;' + __dirname
            }
        });
    }
};