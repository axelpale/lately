var assert = require('./assert');

var distSum = require('../src/lib/distSum');
var fibonacci = require('../src/lib/fibonacci');

describe('lib', function () {

  describe('.distSum(d)', function () {
    it('basic', function () {

      var sum = distSum({
        'a': 2,
        'b': 3,
      });

      assert.about(sum, 5);
    });

    it('empty', function () {

      var sum = distSum({});

      assert.about(sum, 0);
    });
  });

  describe('.fibonacci(n)', function () {
    it('basic', function () {
      assert.about(fibonacci(0), 0);
      assert.about(fibonacci(1), 1);
      assert.about(fibonacci(2), 1);
      assert.about(fibonacci(3), 2);
    });
  });
});
