module.exports = {
  deps: [
    // do not add 'build:misc' so it does not run twise in default task
    'build:server:watch',
    'build:client:watch'
  ]
};
