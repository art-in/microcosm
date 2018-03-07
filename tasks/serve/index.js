const config = require('../../config');

const deps = ['serve:generate-sw-cache', 'serve:static'];

if (config.server.database.dev.start) {
  deps.push('serve:dev-db');
}

module.exports = {
  deps
};
