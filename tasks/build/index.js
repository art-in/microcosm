const config = require('../../config.js');
const packer = require('../packer').pack;

module.exports = function() {
    return packer({
        root: config.src.client.root,
        entry: config.src.client.entry,
        output: {
            path: config.src.client.output.path,
            name: config.src.client.output.name
        },
        isProduction: true
    });
};