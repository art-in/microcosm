const config = require('../../../config.build');

const packConfig = require('../../utils/unit-tests-pack-config');
const runUnitTests = require('../../utils/run-unit-tests');

module.exports = () =>
    runUnitTests({
        packConfig: packConfig,
        entry: config.test.unit.entry,
        watch: true
    });