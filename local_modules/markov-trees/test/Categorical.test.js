
var assert = require('./assert');
var Unit = require('../src/Categorical');

// Event strings
var A = 'a';
var B = 'b';
var C = 'c';

describe('Categorical', function () {

  describe('#Categorical(dist)', function () {
    it('basic', function () {
      var l = new Unit({ 'a': 1, 'b': 1 });
      assert.about(l.prob('a'), 0.5);
    });
  });

  describe('#addMass(dist)', function () {
    it('basic', function () {

      var l = new Unit();
      l.addMass({ 'a': 1, 'b': 2 });

      assert.about(l.prob(A), 0.3333);
    });
  });

  describe('#clone()', function () {
    it('basic', function () {
      var d = new Unit({ 'a': 1, 'b': 3 });
      var c = d.clone();
      assert.equal(c.prob('a'), d.prob('a'));
      assert.equal(c.prob('b'), d.prob('b'));
      assert.equal(c.prob('x'), d.prob('x'));
    });
  });

  describe('#divergenceFrom(cat)', function () {
    it('basic', function () {

      var prior = new Unit({ 'a': 1, 'b': 3 });
      var posterior = new Unit({ 'a': 1, 'b': 1 });

      assert.about(posterior.divergenceFrom(prior), 0.20751);
    });
  });

  describe('#entropy()', function () {
    it('basic', function () {

      var l = new Unit({
        'a': 0.1,
        'b': 0.9,
      });

      var v = -((0.1 * Math.log(0.1)) + (0.9 * Math.log(0.9)));

      assert.about(l.entropy(), v);
    });
  });

  describe('#events()', function () {
    it('basic', function () {

      var l = new Unit();
      l.addMass({ 'a': 1, 'b': 2 });

      assert.sameMembers(l.events(), ['a', 'b']);
    });
  });

  describe('#eventsWithMassAbove()', function () {
    it('basic', function () {

      var l = new Unit();
      l.addMass({ 'a': 1, 'b': 2, 'c': 5 });

      assert.sameMembers(l.eventsWithMassAbove(1.5), ['c', 'b']);
    });
  });

  describe('#forEach()', function () {
    it('basic', function () {

      var cat = new Unit({ 'a': 2, 'b': 3, 'c': 5 }, 10);
      var res = {};

      cat.forEach(function (ev, p) {
        res[ev] = p;
      });

      assert.deepEqual(res, cat.getProbDist());
    });
  });

  describe('#getMassDist()', function () {
    it('basic', function () {

      var l = new Unit({ 'a': 1, 'b': 2 });
      var d = l.getMassDist();

      assert.about(d[A], 1 / 3);
      assert.about(d[B], 2 / 3);
    });
  });

  describe('#getProbDist()', function () {
    it('basic', function () {

      var l = new Unit({ 'a': 1, 'b': 2 }, 2);
      var d = l.getProbDist();

      assert.about(d[A], 1 / 3);
      assert.about(d[B], 2 / 3);
    });
  });

  describe('#has(ev)', function () {
    it('basic', function () {

      var l = new Unit({ 'a': 1, 'b': 3 });

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

      assert.about(l.prob(A), 2 / 3);
    });

    it('dist', function () {

      var l = new Unit();
      l.learn({ 'a': 1, 'b': 1 });

      assert.about(l.weight('a'), 0.5);
      assert.about(l.prob('a'), 0.5);
    });

    it('dist & amount', function () {

      var l = new Unit();
      l.learn({ 'a': 1, 'b': 1 }, 2);
      l.learn('c');

      assert.about(l.prob('a'), 1 / 3);
    });

    it('empty & amount', function () {

      var l = new Unit();
      l.learn({}, 2);

      assert.about(l.weightSum(), 0);
    });

  });

  describe('#prob(ev)', function () {
    it('zero', function () {

      var l = new Unit();

      assert.about(l.prob('a'), 0);
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
      l.addMass({ 'a': 1, 'b': 2 });
      l.substractMass({ 'b': 2 });

      assert.about(l.prob(A), 1);
    });
  });

  describe('#unlearn(ev)', function () {
    it('basic', function () {
      var l = new Unit({ 'a': 1, 'b': 1 }, 2);
      l.unlearn('a');
      assert.about(l.prob('a'), 0);
      assert.about(l.prob('b'), 1);
    });
  });

});
