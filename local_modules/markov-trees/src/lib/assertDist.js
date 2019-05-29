
module.exports = function (d) {
  var k;
  for (k in d) {
    if (d.hasOwnProperty(k)) {
      if (typeof d[k] !== 'number') {
        throw new Error('Invalid distribution');
      }
    }
  }
};
