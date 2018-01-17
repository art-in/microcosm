const gutil = require('gulp-util');
const spawnPouchDBServer = require('spawn-pouchdb-server');

const config = require('../../config.serve');

module.exports = () => {

    const {host, port} = config.server.database;

    if (host !== 'localhost') {
        throw Error(
            `Invalid db server host '${host}'. ` +
            `Dev server can listen at 'localhost' only.`);
    }

    // TODO: spawn pouchdb-server manually to be able to set non-localhost host
    // (spawnPouchDBServer does not have 'host' option, so pouchdb-server
    // defaults to 127.0.0.1)
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