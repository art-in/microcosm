const del = require('del');

const config = require('../../../config');

module.exports = function() {
    return del([
        config.src.serv.output.root + '/**/*'
    ], {force: true});
};