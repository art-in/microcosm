const config = require('../../../../config.js');
const packer = require('../../../utils/packer').pack;

module.exports = {
    deps: ['build:client:clean'],
    fn: function() {
        return packer({
            root: config.src.client.root,
            entry: config.src.client.entry,
            bundleUrlPath: config.src.client.bundleUrlPath,
            output: {
                path: config.src.client.output.bundle.path,
                name: config.src.client.output.bundle.name
            },
            isProduction: true
        });
    }
};