// TODO: split package.json dependencies to "dependencies" and "devDependencies"
//       so we can install only runtime necessary deps in production
module.exports = {
  deps: ['build:misc', 'build:server', 'build:client']
};
