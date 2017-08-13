const config = require('../../../config.js');
const getPackConfig = require('../../packer').getPackConfig;

const packConfig = getPackConfig({
    root: [
        // to explicitly import src/test modules from tests.
        // eg. when importing 'utils' it is not clear
        // whether its source utils or test utils. better
        // use explicit notation 'src/utils' or 'test/utils'
        config.root,

        // for src-modules internal references to work
        config.src.client.root
    ],
    output: {
        path: config.test.unit.output.path,
        name: config.test.unit.output.name
    }
});

module.exports = packConfig;