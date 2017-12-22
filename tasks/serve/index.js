const config = require('../../config');

const deps = ['build', 'serve:static'];

if (config.databaseServer.startDevServer) {
    deps.push('serve:dev-db');
}

module.exports = {
    deps
};