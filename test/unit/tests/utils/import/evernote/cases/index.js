/** @type {Object.<string, string>} */
const cases = {};
const context = require.context('.', true, /\.enex$/);
context.keys().forEach(modulePath => {
  const module = context(modulePath);
  const name = modulePath.match(/.+\/(.+)\./i)[1];
  cases[name] = module;
});

export default cases;
