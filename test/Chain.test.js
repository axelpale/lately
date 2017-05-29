var assert = require('./assert');
var Unit = require('../src/Chain');

var A = 'a';
var B = 'b';

describe('Chain', function () {

  it('basic', function () {

    var u = new Unit();
    u.push([A, B], [1, 1]);

    assert.deepEqual(u.delaysBetween(A, B), [1]);
  });

  describe('#Chain()', function () {
    it('takes two optional arguments', function () {

      var u = new Unit([A, B], [1, 1]);

      assert.strictEqual(u.size(), 2);
    });
  });

  describe('#delaysBetween()', function () {
    it('empty', function () {

      var u = new Unit();

      assert.deepEqual(u.delaysBetween(A, B), []);
    });
  });
});
