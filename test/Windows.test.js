var assert = require('./assert');
var Unit = require('../src/Windows');


describe('Windows', function() {

  describe('#Windows(n)', function() {
    it('basic', function() {

      var w = new Unit(3);

      assert.bout(w.getNumberOfWindows(), 3);
    });
  });

  describe('#feed(ev)', function() {
    it('basic', function() {

      var w = new Unit(3);
      w.feed('a');
      w.feed('b');

      var w0 = w.getWindow(0);
      var w1 = w.getWindow(1);

      assert.bout(w0.prob('b'), 1.0);
      assert.bout(w0.prob('a'), 0.0);
      assert.bout(w1.prob('a'), 0.5);
      assert.bout(w1.prob('b'), 0.0);
    });
  });
});
