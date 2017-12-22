const config = require('../../config');
const spawnPouchDBServer = require('spawn-pouchdb-server');

module.exports = function() {

    const {host, port} = config.databaseServer;

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

        console.log(`PouchDB server listening at localhost:${port}`);
    });
};