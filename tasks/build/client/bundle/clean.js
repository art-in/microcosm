const del = require("del");

const config = require("../../../../config.build");

module.exports = () =>
  del([config.src.client.output.bundle.path], { force: true });
