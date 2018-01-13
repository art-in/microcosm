/* global require, module, __dirname */
const path = require('path');
const extend = require('extend');
const userConfig = require('./config.serve.user');
const abs = p => path.join(__dirname, p);

/**
 * Serve configuration
 * Then one that is used for serving build (added to build folder)
 * 
 * NOTE: do not modify defaults - put custom config to 'config.serve.user.js'
 */
const defaults = {
    server: {

        // nodejs server, which serves static files for browser
        static: {
            host: '0.0.0.0',
            port: 3000,

            // folder from which static files are served to client
            folder: abs('./client/'),

            // entry module for nodejs process
            entry: abs('./server/server.js'),

            // url that client will prefix all relative server requests with.
            // use when server hosted not on root path (ie. through proxying).
            // relative and absolute paths are allowed (eg. '/microcosm/')
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base
            baseUrl: '/'
        },
     
        // couchdb-compatible database server
        database: {
            
            host: 'localhost',
            port: 5984,

            // start development database server (pouchdb-server).
            // note: pouchdb-server is not production ready, so you should
            // install and run your own CouchDB server elsewhere.
            // when true - host can be 'localhost' only
            startDevServer: true
        }
    }
};

module.exports = extend(true, {}, defaults, userConfig);