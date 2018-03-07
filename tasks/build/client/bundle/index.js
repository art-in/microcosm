const buildConfig = require('../../../../config.build.js');
const packer = require('../../../utils/packer').pack;

module.exports = {
  deps: ['build:client:bundle:clean'],
  fn: () =>
    packer({
      root: buildConfig.src.client.root,
      entry: buildConfig.src.client.entry,
      bundleUrlPath: buildConfig.src.client.bundleUrlPath,
      static: buildConfig.src.client.static,
      output: {
        bundle: {
          path: buildConfig.src.client.output.bundle.path,
          name: buildConfig.src.client.output.bundle.name
        }
      },
      isProduction: true
    })
};
