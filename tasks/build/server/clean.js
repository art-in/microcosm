const del = require('del');

const config = require('../../../config');

module.exports = () =>
    del([
        config.src.serv.output.root + '/**/*'
    ], {force: true});