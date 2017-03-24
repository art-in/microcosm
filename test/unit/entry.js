/* global require, module */

// dynamically import all test files
// https://webpack.github.io/docs/context.html
const context = require.context('./tests/', true, /\.test\.js$/);
context.keys().forEach(context);
module.exports = context;