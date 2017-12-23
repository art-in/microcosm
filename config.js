/* global require, module */
const extend = require('extend');

const defaults = require('./config.defaults');
const user = require('./config.user');

module.exports = extend(true, {}, defaults, user);