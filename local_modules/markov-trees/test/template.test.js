var assert = require('./assert');
var Unit = require('../src/Layer');


describe('Class', function () {

  describe('#method()', function () {
    it('basic', function () {

      var u = new Unit();
      var a = 1;

      assert.strictEqual(u, u);
      assert.about(a, 1);
    });
  });
});
