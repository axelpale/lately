var assert = require('./assert');
var Unit = require('../src/Context');


describe('Context', function () {

  describe('#feed(ev)', function () {

    it('basic', function () {

      var cx = new Unit();
      cx.feed('b');
      cx.feed('a');

      var ac = cx.getActive();

      assert.sameDeepMembers(ac, [ '0/a', '1/b', Unit.ANY]);
    });
  });

});
