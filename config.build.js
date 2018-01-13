/* global require, module, __dirname */
const path = require('path');
const extend = require('extend');
const userConfig = require('./config.build.user');
const abs = p => path.join(__dirname, p);

/**
 * Build configuration
 * The one that is used for building and testing sources
 * 
 * NOTE: do not modify defaults - put custom config to 'config.build.user.js'
 */
const defaults = {
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
            output: {
                root: abs('./.build/client/'),
                bundle: {
                    path: abs('./.build/client/bundle/'),
                    name: 'bundle.js'
                }
            },

            // url path that will prefix all bundle chunk urls (eg. fonts).
            // if starts with slash then considered as absolute path, omit it if
            // want chunks urls to be auto-prefixed with base url
            bundleUrlPath: 'bundle/'
        },
        output: {
            root: abs('./.build/')
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
            port: 3001,

            // folder from which static files are served to client
            folder: abs('./.build/client/')
        }
    }
};

module.exports = extend(true, {}, defaults, userConfig);