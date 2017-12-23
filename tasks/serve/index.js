const config = require('../../config');

const deps = ['build', 'serve:static'];

if (config.server.database.startDevServer) {
    deps.push('serve:dev-db');
}

module.exports = {
    deps
};