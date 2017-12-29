const config = require('../../config.js');
const getPackConfig = require('./packer').getPackConfig;

const packConfig = getPackConfig({
    root: [
        // allow to import source or test modules from tests explicitly.
        // eg. when importing 'utils' from test it is not clear whether it is
        // source utils or test utils. better to use explicit notation:
        // 'src/utils' or 'test/utils'
        config.root,

        // for src-modules internal references to work
        config.src.client.root
    ],
    bundleUrlPath: config.src.client.bundleUrlPath,
    output: {
        path: config.test.unit.output.path,
        name: config.test.unit.output.name
    },
    isProduction: false
});

module.exports = packConfig;