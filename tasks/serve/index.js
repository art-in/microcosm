const config = require('../../config.serve');

const deps = [
    'serve:static'
];

if (config.server.database.dev.start) {
    deps.push('serve:dev-db');
}

module.exports = {
    deps
};