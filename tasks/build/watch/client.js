const config = require('../../../config.js');
const packer = require('../../packer').pack;

// running 'build:watch' task mistakenly also runs 'build' in parallel.
// ignoring it for now, since one extra build on start is not a big deal.
// but should be fixed in 'gulp-require-tasks' or somehow locally in the end.
// https://github.com/betsol/gulp-require-tasks/issues/23

module.exports = function() {
    return packer({
        root: config.src.client.root,
        entry: config.src.client.entry,
        output: {
            path: config.src.client.output.path,
            name: config.src.client.output.name
        },
        watch: true,
        serv: {
            host: config.dev.server.host,
            port: config.dev.server.port,
            public: config.src.serv.public
        },
        isProduction: false
    });
};