const gutil = require('gulp-util');
const spawnPouchDBServer = require('spawn-pouchdb-server');

const config = require('../../config');

module.exports = function() {

    const {host, port} = config.server.database;

    if (host !== 'localhost') {
        throw Error(
            `Invalid db server host '${host}'. ` +
            `Dev server can be started at 'localhost' only.`);
    }

    spawnPouchDBServer({
        port,
        directory: './.db'
    }, function(error) {
        if (error) {
            throw error;
        }

        gutil.log(`PouchDB server listening at localhost:${port}`);
    });
};