module.exports = {
  deps: [
    // no watch mode for static files for now
    'build:client:static',
    'build:client:bundle:watch'
  ]
};
