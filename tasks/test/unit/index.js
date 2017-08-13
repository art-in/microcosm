const config = require('../../../config.js');
const runUnitTests = require('./run-unit-tests');
const packConfig = require('./pack-config');

module.exports = {
    deps: ['test:static'],
    fn: function() {
        return runUnitTests({
            packConfig,
            entry: config.test.unit.entry,
            watch: false
        });
    }
};