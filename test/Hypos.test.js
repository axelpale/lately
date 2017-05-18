var assert = require('./assert');
var Unit = require('../src/Hypos');


describe('Hypos', function () {

  describe('#Hypos()', function () {
    it('basic', function () {

      var hs = new Unit();

      hs.learn(['0/a', '1/b'], 'a');

      console.log(hs.predict(['1/b']));

      assert.equal(hs.predict(['1/b']).mode(), 'a');
    });
  });
});
