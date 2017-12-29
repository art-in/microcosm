const config = require('../../../config.js');

const packConfig = require('../../utils/unit-tests-pack-config');
const runUnitTests = require('../../utils/run-unit-tests');

module.exports = function() {
    return runUnitTests({
        packConfig: packConfig,
        entry: config.test.unit.entry,
        watch: true
    });
};