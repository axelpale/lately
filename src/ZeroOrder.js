// 0:th order predictor
// Uses single categorical distribution to predict upcoming events.

var Categorical = require('./Categorical');

var P = function ZeroOrder() {
  this.mem = new Categorical();
};

P.prototype.feed = function (ev) {
  // Returns
  //   the prediction as a Categorical
  this.mem.learn(ev);

  return this.mem.clone();
};

module.exports = P;
