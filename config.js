/* global require, module, __dirname */
const path = require('path');
const abs = p => path.join(__dirname, p);

module.exports = {
    root: __dirname,
    src: {
        serv: {
            root: abs('src/server/'),
            entry: abs('src/server/entry.js'),
            public: abs('src/ui/public')
        },
        client: {
            root: abs('./src/'),
            entry: abs('./src/ui/public/client'),
            output: {
                path: abs('./src/ui/public/build/'),
                name: 'bundle.js'
            }
        }
    },
    test: {
        root: abs('./test/'),
        unit: {
            entry: abs('test/unit/entry.js'),
            output: {
                path: abs('./test/unit/build/'),
                name: 'bundle-test.js'
            }
        }
    },
    dev: {
        server: {
            host: 'localhost',
            port: 3001
        }
    },
    server: {
        host: '0.0.0.0',
        port: 3000
    }
};