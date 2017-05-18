module.exports = function (prior, p) {
  // The greater the p to prior, the bigger the reward.
  // If p is smaller than prior, returns negative.
  // The difference in the low or high end of the probability range
  // yields greater rewards than in around 0.5.
  return Math.log(p / (1 - p)) - Math.log(prior / (1 - prior));
};
