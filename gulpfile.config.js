/* global module, __dirname */
module.exports = {
    root: __dirname,
    src: {
        serv: {
            root: 'src/server/',
            entry: 'src/server/entry.js',
            public: 'src/ui/public'
        },
        client: {
            root: './src/',
            entry: './src/ui/public/client',
            output: {
                path: './src/ui/public/build/',
                name: 'bundle.js'
            }
        }
    },
    test: {
        root: './test/',
        unit: {
            entry: 'test/unit/entry.js',
            output: {
                path: './test/unit/build/',
                name: 'bundle-test.js'
            }
        }
    }
};