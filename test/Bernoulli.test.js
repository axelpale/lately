var assert = require('./assert');
var Unit = require('../src/Bernoulli');


describe('Bernoulli', function () {

  describe('#Bernoulli()', function () {
    it('basic', function () {

      var b = new Unit();
      b.learn(['a', 'b']);

      assert.bout(b.prob('a'), 1);
    });
  });

  describe('#learn(evs)', function () {
    it('empty', function () {

      var b = new Unit();
      b.learn([]);
      b.learn(['a']);

      assert.bout(b.prob('a'), 0.5);
    });
  });

  describe('#sample()', function () {
    it('basic', function () {

      var b = new Unit();
      b.learn(['a', 'b']);
      b.learn(['a']);

      var N = 1000;
      var i, s, ev;
      var n = {};

      for (i = 0; i < N; i += 1) {
        s = b.sample();
        for (j = 0; j < s.length; j += 1) {
          ev = s[j];
          if (n.hasOwnProperty(ev)) {
            n[ev] += 1;
          } else {
            n[ev] = 1;
          }
        }
      }

      assert.bout(n['a'], N);
      assert.isAbout(n['b'], N / 2, 200);
    });
  });
});
