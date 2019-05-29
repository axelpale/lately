var assert = require('./assert');
var Unit = require('../src/Chain');

var A = 'a';
var B = 'b';
var C = 'c';

describe('Chain', function () {

  it('basic', function () {

    var u = new Unit();
    u.push([A, B], [1, 1]);

    assert.deepEqual(u.delaysBetween(A, B), [1]);
    assert.about(u.frequencies().get(A), 1);
    assert.about(u.frequencies().get(B), 1);
  });

  describe('#Chain()', function () {
    it('takes two optional arguments', function () {

      var u = new Unit([A, B], [1, 1]);

      assert.strictEqual(u.size(), 2);
    });
  });

  describe('#delaysBetween(a, b)', function () {
    it('empty', function () {
      var u = new Unit();
      assert.deepEqual(u.delaysBetween(A, B), []);
    });

    it('two', function () {
      var u = new Unit([A, B, A, B], [1, 1, 1, 1]);
      assert.deepEqual(u.delaysBetween(A, B), [1, 1]);
      assert.deepEqual(u.delaysBetween(B, A), [1]);
    });

    it('non-existing', function () {
      var u = new Unit([A, B], [1, 1]);
      assert.deepEqual(u.delaysBetween(B, C), []);
      assert.deepEqual(u.delaysBetween(B, A), []);
    });
  });

  describe('#discreteFrom(ev)', function () {
    var u = new Unit([A, B], [1, 1]);
    var da = u.discreteFrom(A);
    var db = u.discreteFrom(B);
    assert.strictEqual(da.get(A), 0);
    assert.strictEqual(da.get(B), 1);
    assert.strictEqual(db.get(A), 0);
    assert.strictEqual(db.get(B), 0);
  });
});
