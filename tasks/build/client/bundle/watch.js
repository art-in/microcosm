const buildConfig = require('../../../../config.build');
const serveConfig = require('../../../../config.serve');

const packer = require('../../../utils/packer').pack;

module.exports = {
    deps: ['build:client:bundle:clean'],
    fn: () => packer({
        root: buildConfig.src.client.root,
        entry: buildConfig.src.client.entry,
        bundleUrlPath: buildConfig.src.client.bundleUrlPath,
        output: {
            path: buildConfig.src.client.output.bundle.path,
            name: buildConfig.src.client.output.bundle.name
        },
        watch: true,
        serv: {
            host: buildConfig.dev.server.host,
            port: buildConfig.dev.server.port,
            folder: buildConfig.src.client.output.root,
            backend: {
                host: serveConfig.server.static.host,
                port: serveConfig.server.static.port
            }
        },
        isProduction: false
    })
};