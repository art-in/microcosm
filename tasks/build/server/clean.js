const del = require('del');

const config = require('../../../config.build');

module.exports = () =>
    del([
        config.src.serv.output.root + '/**/*'
    ], {force: true});