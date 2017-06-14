var assert = require('./assert');
var Unit = require('../src/TreeNode');


describe('TreeNode', function () {

  it('basic', function () {

    var u = new Unit();

    assert.equal(u.getParent(), null);
    assert.equal(u.isRoot(), true);
    assert.equal(u.isMature(), true);
  });

  describe('#get(key) #set(key,value)', function () {
    it('basic', function () {

      var u = new Unit();

      var a = u.get('a');
      assert.isUndefined(a);

      var b = u.set('b', 'foo');
      assert.isUndefined(b);

      var c = u.get('b');
      assert.equal(c, 'foo');

      u.set(1, 'bar');
      var d = u.get(1);
      assert.equal(d, 'bar');

      var e = u.set(1, 'baz');
      assert.equal(e, 'bar');  // Previous value

    });
  });
});
