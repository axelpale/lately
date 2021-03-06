var assert = require('./assert');
var Unit = require('../src/Decaying');

// Event strings
var A = 'a';
var B = 'b';
var C = 'c';

describe('Decaying', function () {

  it('basic', function () {
    var l = new Unit(0.9999);
    l.learn(A);
    l.learn(B);
    l.learn(C);
    l.learn(B);

    assert.isAbout(l.prob(A), 0.25, 0.1);
    assert.isTrue(l.has(B));
    assert.isAbout(l.getProbDist()[A], 0.25, 0.1);
  });

  describe('#getProbDist()', function () {
    it('empty', function () {
      var l = new Unit(0.5);
      assert.deepEqual(l.getProbDist(), {});
    });
  });

  describe('#learn(ev)', function () {

    it('amount', function () {

      var l = new Unit(0.9);
      l.learn(B, 2);
      l.learn(A, 0.5);
      l.learn(A, 0.5);

      var m = new Unit(0.9);
      m.learn(B, 2);
      m.learn(A);

      assert.about(l.prob(A), m.prob(A));
      assert.about(l.prob(B), m.prob(B));
    });
  });

  describe('#learnDist(dist)', function () {
    it('basic', function () {

      var l = new Unit(0.9);
      l.learn({ 'a': 1, 'b': 3 });

      assert.about(l.prob('a'), 0.25);
    });
  });

  describe('#prob(ev)', function () {
    it('empty', function () {

      var l = new Unit(0.9);
      assert.about(l.prob('a'), 0);
    });
  });
});
