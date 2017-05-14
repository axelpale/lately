var assert = require('./assert');

var distSum = require('../src/lib/distSum');
var fibonacci = require('../src/lib/fibonacci');

describe('lib', function() {

  describe('.distSum(d)', function() {
    it('basic', function() {

      var sum = distSum({
        'a': 2,
        'b': 3,
      });

      assert.bout(sum, 5);
    });

    it('empty', function() {

      var sum = distSum({});

      assert.bout(sum, 0);
    });
  });

  describe('.fibonacci(n)', function () {
    it('basic', function () {
      assert.bout(fibonacci(0), 0);
      assert.bout(fibonacci(1), 1);
      assert.bout(fibonacci(2), 1);
      assert.bout(fibonacci(3), 2);
    });
  });
});
