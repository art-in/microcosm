const buildConfig = require('../../config.build');
const getPackConfig = require('./packer').getPackConfig;

const packConfig = getPackConfig({
  root: [
    // allow to import source or test modules from tests explicitly.
    // eg. when importing 'utils' from test it is not clear whether it is
    // source utils or test utils. better to use explicit notation:
    // 'src/utils' or 'test/utils'
    buildConfig.root,

    // for src-modules internal references to work
    buildConfig.src.client.root
  ],
  bundleUrlPath: buildConfig.src.client.bundleUrlPath,
  output: {
    bundle: {
      path: buildConfig.test.unit.output.path,
      name: buildConfig.test.unit.output.name
    }
  },
  isProduction: false,
  coverage: true
});

module.exports = packConfig;
