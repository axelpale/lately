module.exports = function (prior, p) {
  // The greater the p to prior, the bigger the reward.
  // If p is smaller than prior, returns negative.
  // A difference in the low or high end of the probability range will
  // yield greater rewards than around 0.5.
  return Math.log((0.1 + p) / (1.1 - p))
    - Math.log((0.1 + prior) / (1.1 - prior));
};
