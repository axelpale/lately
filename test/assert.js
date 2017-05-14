var chai = require('chai');
var assert = chai.assert;

assert.isAbout = function (x, expected, deviation) {
  assert.isAtLeast(x, expected - deviation);
  assert.isAtMost(x, expected + deviation);
};

assert.bout = function (x, expected) {
  assert.isAbout(x, expected, Math.abs(expected * 0.01) + 0.01);
};

module.exports = assert;
