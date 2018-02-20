const config = require('../../../../config.build.js');
const packer = require('../../../utils/packer').pack;

module.exports = {
  deps: ['build:client:bundle:clean'],
  fn: () =>
    packer({
      root: config.src.client.root,
      entry: config.src.client.entry,
      bundleUrlPath: config.src.client.bundleUrlPath,
      output: {
        bundle: {
          path: config.src.client.output.bundle.path,
          name: config.src.client.output.bundle.name
        },
        sw: {
          path: config.src.client.output.sw.path,
          name: config.src.client.output.sw.name
        }
      },
      isProduction: true
    })
};
