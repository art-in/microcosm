/* global require, module, __dirname */
const extend = require('extend');
const abs = require('./tasks/utils/join-path')(__dirname);
const userConfig = require('./config.user');

/**
 * Run-time configuration.
 *
 * NOTE 1: do not modify defaults - put custom config to 'config.user.js'.
 *         turn off changes tracking to avoid accidental push to upstream:
 *         git update-index --assume-unchanged config.user.js
 * NOTE 2: restart nodejs to apply changes
 */
const defaults = {
  client: {
    // user signup form
    signup: {
      // allow signing up with invite code only
      invite: {on: false, code: 'welcome'}
    }
  },
  server: {
    // nodejs server, which serves static files to browser and provides rest api
    static: {
      host: '0.0.0.0',
      port: 3000,

      // folder from which static files are served to client
      folder: abs('./client/'),

      // entry module for nodejs process
      entry: abs('./server/server.js'),

      // secure client-server connection (https)
      secure: {
        enabled: false,
        key: 'path/to/key.pem',
        cert: 'path/to/cert.pem'
      },

      // log format (common, combined, dev, etc.)
      // https://github.com/expressjs/morgan#predefined-formats
      logFormat: 'dev'
    },

    // couchdb-compatible database server
    database: {
      // url of db server that client will be connecting to.
      // in case using dev server - this is its start parameters.
      url: {
        protocol: 'http',
        host: 'localhost',
        port: 5984,
        path: ''
      },

      // credentials of database server administrator. it never goes to client.
      // used only to sign up new users (to add user and create databases).
      // admin authentication can be skipped if server has no admin yet.
      auth: {on: false, name: 'admin', password: 'admin'},

      // development database server (pouchdb-server).
      // note 1: pouchdb-server is not production ready, so you should
      // install and run your own couchdb server for production.
      // node 2: dev server does not support https currently. as such, it
      // cannot be used if static is served through https (mixed content).
      // you should serve static over http or run separate db server over https.
      // note 3: any-ip-meta-address-'0.0.0.0' will not work as host
      // (server will start, but client will not be able to connect)
      dev: {start: true, dir: './.db'}
    }
  }
};

module.exports = extend(true, {}, defaults, userConfig);
