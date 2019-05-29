
var R5 = Math.sqrt(5);
var PHI = (1 + R5) / 2;

module.exports = function (n) {
  var asymp = Math.pow(PHI, n) / R5;
  return Math.round(asymp);
};
