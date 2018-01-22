const config = require('../../../../config.build.js');
const packer = require('../../../utils/packer').pack;

module.exports = {
    deps: ['build:client:bundle:clean'],
    fn: () => packer({
        root: config.src.client.root,
        entry: config.src.client.entry,
        bundleUrlPath: config.src.client.bundleUrlPath,
        output: {
            path: config.src.client.output.bundle.path,
            name: config.src.client.output.bundle.name
        },
        isProduction: true
    })
};