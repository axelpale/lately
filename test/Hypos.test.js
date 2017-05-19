var assert = require('./assert');
var Unit = require('../src/Hypos');

var A = 'a';
var B = 'b';


describe('Hypos', function () {

  describe('#learn(cevs, ev)', function () {

    it('one', function () {
      // Performance after one sample

      var hs = new Unit();
      hs.learn(['0/a', '1/b'], A);

      assert.equal(hs.predict(['1/b']).mode(), A);
      assert.equal(hs.predict(['0/a']).mode(), A);
    });

    it('three', function () {
      // Performance after three samples

      var hs = new Unit();
      hs.learn(['0/a', '1/b'], A);
      hs.learn(['0/a', '1/b'], B);
      hs.learn(['2/c'], B);

      //console.log(hs.predict(['1/b']).getProbDist());

      assert.about(hs.predict(['1/b']).prob(B), 0.5);
      assert.about(hs.predict(['0/a']).prob(A), 0.5);
      assert.about(hs.predict(['2/c']).prob(A), 0);
      assert.about(hs.predict(['2/c']).prob(B), 1);
    });

    it('unconditioned', function () {
      // If no conditions are given, no learning should happen.
      // If a hypo for event's independence needs to be created,
      // then there should be a ANY event in the context.

      var hs = new Unit();
      hs.learn([], A);
      hs.learn([], B);

      assert.about(hs.predict(['huh']).prob(B), 0);
      assert.about(hs.predict([]).prob(A), 0);
    });
  });

  describe('#predict(cevs)', function () {
    it('empty', function () {
      var hs = new Unit();

      assert.deepEqual(hs.predict(['1/b']).getProbDist(), {});
    });
  });
});
