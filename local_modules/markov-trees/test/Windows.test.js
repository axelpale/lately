var assert = require('./assert');
var Unit = require('../src/Windows');


describe('Windows', function () {

  describe('#Windows(sizes)', function () {
    it('basic', function () {

      var w = new Unit([1, 1]);

      assert.about(w.getNumberOfWindows(), 2);
    });

    it('should have correct window weights', function () {
      var w = new Unit([1, 1, 2, 3, 5]);

      // 1 + 1 + 2 + 3 + 5 = 12
      var i;
      for (i = 0; i < 12; i += 1) {
        w.feed('a');
      }

      assert.about(w.getWindow(0).weightSum(), 1);
      assert.about(w.getWindow(1).weightSum(), 1);
      assert.about(w.getWindow(2).weightSum(), 2);
      assert.about(w.getWindow(3).weightSum(), 3);
      assert.about(w.getWindow(4).weightSum(), 5);
    });
  });

  describe('#feed(ev)', function () {

    it('basic', function () {

      var w = new Unit([1, 1, 2]);
      w.feed('b');
      w.feed('a');
      w.feed('b');
      w.feed('a');

      var w0 = w.getWindow(0);
      var w1 = w.getWindow(1);
      var w2 = w.getWindow(2);

      assert.about(w0.prob('a'), 1.0);
      assert.about(w0.prob('b'), 0.0);
      assert.about(w1.prob('a'), 0.0);
      assert.about(w1.prob('b'), 1.0);
      assert.about(w2.prob('a'), 0.5);
      assert.about(w2.prob('b'), 0.5);
    });
  });

  describe('#getActive()', function () {

    it('basic', function () {

      var w = new Unit([1, 1, 2]);
      w.feed('a');
      w.feed('b');
      w.feed('a');

      var cevs = w.getActive();

      assert.sameDeepMembers(cevs, [ '0/a', '1/b', '2/a']);
    });
  });

});
