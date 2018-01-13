const config = require('../../config.serve');

const deps = [
    'serve:static:watch'
];

if (config.server.database.startDevServer) {
    deps.push('serve:dev-db');
}

module.exports = {
    deps
};