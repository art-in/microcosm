/* global module, require, __dirname */

const path = require('path');

module.exports = {
    src: {
        serv: {
            root: 'src/server/',
            entry: 'src/server/entry.js'
        },
        client: {
            root: './src/',
            entry: './src/public/client',
            output: {
                path: getAbsolutePath('./src/build/'),
                name: 'bundle.js'
            }
        }
    },
    test: {
        unit: {
            entry: 'test/unit/entry.js',
            output: {
                path: './test/unit/build/',
                name: 'bundle-test.js'
            }
        }
    }
};

/**
 * Gets absolute path from relative to current folder
 * @param {string} relative
 * @return {string}
 */
function getAbsolutePath(relative) {
    let abs = path.resolve(__dirname, relative);

    // FIXME:
    // uppercase drive letter so webpack@2.3.0 not breaks
    // https://github.com/webpack/webpack/issues/4530
    abs = abs.charAt(0).toUpperCase() + abs.slice(1).toLowerCase();

    return abs;
}
