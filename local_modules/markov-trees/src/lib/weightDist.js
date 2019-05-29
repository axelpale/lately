module.exports = function (dist, w) {
  // Multiply distribution values by w.
  // Dist is mapping evName -> number

  var d = {};

  var k;
  for (k in dist) {
    if (dist.hasOwnProperty(k)) {
      d[k] = w * dist[k];
    }
  }

  return d;
};
