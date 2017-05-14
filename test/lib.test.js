var assert = require('./assert');

var distSum = require('../src/lib/distSum');

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
});
