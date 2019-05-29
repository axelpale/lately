
// Prevent zero prior or p causing trouble in the neighborhood.
var ALPHA = 0.1;

module.exports = function (prior, p) {
  // The greater the p to prior, the bigger the reward.
  // If p is smaller than prior, returns negative.
  // A difference in the low or high end of the probability range will
  // yield greater rewards than around 0.5.
  return Math.log((ALPHA + p) / (ALPHA + 1 - p)) -
    Math.log((ALPHA + prior) / (ALPHA + 1 - prior));
};
