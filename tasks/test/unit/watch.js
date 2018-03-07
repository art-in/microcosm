const buildConfig = require('../../../config.build');

const packConfig = require('../../utils/unit-tests-pack-config');
const runUnitTests = require('../../utils/run-unit-tests');

module.exports = () =>
  runUnitTests({
    packConfig: packConfig,
    entry: buildConfig.test.unit.entry,
    watch: true
  });
