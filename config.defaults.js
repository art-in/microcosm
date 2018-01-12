/* global require, module, __dirname */
const path = require('path');
const abs = p => path.join(__dirname, p);

/**
 * Do not modify defaults - put custom config into 'config.user.js'
 */

module.exports = {
    root: __dirname,
    src: {
        serv: {
            root: abs('src/boot/server/'),
            output: {
                root: abs('./.build/server/'),
                entry: abs('./.build/server/server.js')
            }
        },
        client: {
            root: abs('./src/'),
            entry: abs('./src/boot/client/client'),
            static: abs('./src/boot/client/static/'),
            bundleUrlPath: 'bundle/',
            output: {
                root: abs('./.build/client/'),
                bundle: {
                    path: abs('./.build/client/bundle/'),
                    name: 'bundle.js'
                }
            }
        }
    },
    test: {
        root: abs('./test/'),
        static: {
            tsConfig: abs('./tsconfig.json')
        },
        unit: {
            entry: abs('test/unit/entry.js'),
            output: {
                path: abs('./test/unit/build/'),
                name: 'bundle-test.js'
            }
        }
    },
    dev: {

        // webpack dev server, which serves static files and live rebuilds
        // client bundle while in watch development mode
        server: {
            host: '0.0.0.0',
            port: 3001
        }
    },
    server: {

        // nodejs server, which serves static files for browser
        static: {
            host: '0.0.0.0',
            port: 3000,

            // folder from which static files are served to client
            folder: abs('./.build/client/')
        },

        // couchdb-compatible database server
        database: {
            host: 'localhost',
            port: 5984,
    
            // start development database server (pouchdb-server).
            // note: pouchdb-server is not production ready, so you should
            // install and run your own CouchDB server elsewhere
            startDevServer: true
        }
        
    }
};