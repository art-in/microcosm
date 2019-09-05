module.exports = {
  deps: [
    // do not add 'build:misc' so it does not run twice in default task
    'build:server:watch',
    'build:client:watch'
  ]
};
