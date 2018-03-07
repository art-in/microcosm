const buildConfig = require('../../../config.build');

const runUnitTests = require('../../utils/run-unit-tests');
const packConfig = require('../../utils/unit-tests-pack-config');

module.exports = () =>
  runUnitTests({
    packConfig,
    entry: buildConfig.test.unit.entry,
    watch: false
  });
