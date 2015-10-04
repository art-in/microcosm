// JSS
var jss = require('jss').create();
var jssNested = require('jss-nested');
jss.use(jssNested);

useSheet = require('react-jss')(jss);

// classnames
cx = require('classnames');

// EventEmitter
EventEmitter = require('events');

// assert
assert = require('assert');