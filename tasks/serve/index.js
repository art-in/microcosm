const config = require('../../config');

const deps = [
    'serve:static'
];

if (config.server.database.startDevServer) {
    deps.push('serve:dev-db');
}

module.exports = {
    deps
};