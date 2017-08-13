const config = require('../../../config.js');
const packConfig = require('./pack-config');
const runUnitTests = require('./run-unit-tests');

module.exports = function(done) {
    return runUnitTests({
        packConfig: packConfig,
        entry: config.test.unit.entry,
        watch: true
    });
};