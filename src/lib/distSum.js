
module.exports = function (d) {
  var sum = 0;
  var k;
  for (k in d) {
    if (d.hasOwnProperty(k)) {
      sum += d[k];
    }
  }
  return sum;
};
