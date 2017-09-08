/* global require */

// transpile on the fly
// TODO: precompile server
require('babel-register');
require('babel-polyfill');

require('./server.js');