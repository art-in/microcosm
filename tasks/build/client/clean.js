const del = require('del');

const config = require('../../../config');

module.exports = () =>
    del([
        config.src.client.output.root
    ], {force: true});