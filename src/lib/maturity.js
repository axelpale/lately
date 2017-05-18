module.exports = function (h) {
  // Maturity of a hypothesis h, a number in range 0..1.
  //
  // Background:
  //   A categorical distribution has a Dirichlet distribution
  //   as its conjugate prior. The Dirichlet distribution gives
  //   us the variance of the probabilities that form
  //   the estimated categorical distribution [1]:
  //
  //   Var(P_i) = a_i * (a_0 - a_i) / (a_0**2 * (a_0 + 1))
  //
  //   Deriving this in a closed form to a good maturity function
  //   quickly turns out to be too complex job to be worth it.
  //   Therefore we built an simulation under lately-simulations
  //   to examine how the expected reward diminishes as the sample size
  //   grows.
  //
  //   The simulation experiment showed that the expected reward
  //   depends on both sample size and the dimensionality of
  //   the distribution. Based on results we chose an approximate
  //   maturity function: 1 - sqrt(2 / x).
  //
  // References:
  //   [1] https://en.wikipedia.org/wiki/Dirichlet_distribution

  var sampleSize = h.weightSum();

  if (sampleSize < 1) {
    return 0;
  }

  return 1 - Math.sqrt(2 / sampleSize);
};
