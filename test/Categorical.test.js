
var assert = require('./assert');
var Unit = require('../src/Categorical');

// Event strings
var A = 'a';
var B = 'b';
var C = 'c';

describe('Categorical', function () {

  describe('#Categorical(w)', function () {
    it('basic', function () {
      var l = new Unit({'a': 1, 'b': 1});
      assert.bout(l.prob('a'), 0.5);
    });
  });

  describe('#addMass(dist)', function () {
    it('basic', function () {

      var l = new Unit();
      l.addMass({'a': 1, 'b': 2});

      assert.bout(l.prob(A), 0.3333);
    });
  });

  describe('#entropy()', function () {
    it('basic', function () {

      var l = new Unit({
        'a': 0.1,
        'b': 0.9,
      });

      var v = -(0.1 * Math.log(0.1) + 0.9 * Math.log(0.9));

      assert.bout(l.entropy(), v);
    });
  });

  describe('#events()', function () {
    it('basic', function () {

      var l = new Unit();
      l.addMass({'a': 1, 'b': 2});

      assert.sameMembers(l.events(), ['a', 'b']);
    });
  });

  describe('#eventsWithMassAbove()', function () {
    it('basic', function () {

      var l = new Unit();
      l.addMass({'a': 1, 'b': 2, 'c': 5});

      assert.sameMembers(l.eventsWithMassAbove(1.5), ['c', 'b']);
    });
  });

  describe('#getMassDist()', function () {
    it('basic', function () {

      var l = new Unit({'a': 1, 'b': 2});
      var d = l.getMassDist();

      assert.bout(d['a'], 1 / 3);
      assert.bout(d['b'], 2 / 3);
    });
  });

  describe('#getProbDist()', function () {
    it('basic', function () {

      var l = new Unit({'a': 1, 'b': 2}, 2);
      var d = l.getProbDist();

      assert.bout(d['a'], 1 / 3);
      assert.bout(d['b'], 2 / 3);
    });
  });

  describe('#has(ev)', function () {
    it('basic', function () {

      var l = new Unit({'a': 1, 'b': 3});

      assert.isTrue(l.has('a'));
      assert.isFalse(l.has('c'));
    });
  });

  describe('#learn(ev)', function () {
    it('basic', function () {

      var l = new Unit();
      l.learn(A);
      l.learn(B);
      l.learn(C);
      l.learn(B);

      assert.isAbout(l.prob(A), 0.25, 0.01);
    });

    it('amount', function () {

      var l = new Unit();
      l.learn(A, 2);
      l.learn(B, 1);

      assert.bout(l.prob(A), 2 / 3);
    });

    it('dist', function () {

      var l = new Unit();
      l.learn({ 'a': 1, 'b': 1 });

      assert.bout(l.weight('a'), 0.5);
      assert.bout(l.prob('a'), 0.5);
    });

    it('dist & amount', function () {

      var l = new Unit();
      l.learn({ 'a': 1, 'b': 1 }, 2);
      l.learn('c');

      assert.bout(l.prob('a'), 1 / 3);
    });

    it('empty & amount', function () {

      var l = new Unit();
      l.learn({}, 2);

      assert.bout(l.weightSum(), 0);
    });

  });

  describe('#prob(ev)', function () {
    it('zero', function () {

      var l = new Unit();

      assert.bout(l.prob('a'), 0);
    });
  });

  describe('#sample()', function () {
    it('basic', function () {
      var l = new Unit({ 'a': 1 });
      assert.strictEqual(l.sample(), 'a');
    });
  });

  describe('#substractMass(dist)', function () {
    it('basic', function () {

      var l = new Unit();
      l.addMass({'a': 1, 'b': 2});
      l.substractMass({'b': 2});

      assert.bout(l.prob(A), 1);
    });
  });

  describe('#unlearn(ev)', function () {
    it('basic', function () {
      var l = new Unit({ 'a': 1, 'b': 1 }, 2);
      l.unlearn('a');
      assert.bout(l.prob('a'), 0);
      assert.bout(l.prob('b'), 1);
    });
  });

});
