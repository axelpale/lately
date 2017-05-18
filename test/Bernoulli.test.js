var assert = require('./assert');
var Unit = require('../src/Bernoulli');

// Event strings
var A = 'a';
var B = 'b';

describe('Bernoulli', function () {

  describe('#Bernoulli()', function () {
    it('basic', function () {

      var b = new Unit();
      b.learn([A, B]);

      assert.bout(b.prob(A), 1);
    });
  });

  describe('#learn(evs)', function () {
    it('empty', function () {

      var b = new Unit();
      b.learn([]);
      b.learn([A]);

      assert.bout(b.prob(A), 0.5);
    });
  });

  describe('#prob(evs)', function () {
    it('basic', function () {

      var b = new Unit();
      b.learn(['a', 'b']);
      b.learn([]);

      assert.bout(b.prob(['a', 'b']), 0.25);
      assert.bout(b.prob([]), 0.25);
    });
  });

  describe('#sample()', function () {
    it('basic', function () {

      var b = new Unit();
      b.learn([A, B]);
      b.learn([A]);

      var N = 1000;
      var i, j, s, ev;
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

      assert.bout(n[A], N);
      assert.isAbout(n[B], N / 2, 200);
    });
  });
});
