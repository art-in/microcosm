const del = require("del");

const config = require("../../../../config.build");

module.exports = () =>
  // to simplify code, clean entire client folder including bundle.
  // but it is more appropriate to clean only static output here.
  // since bundle task is more time consuming than clean task, build will
  // always end after clean, so there should not be any conflict.
  del([config.src.client.output.root], { force: true });
