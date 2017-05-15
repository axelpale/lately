// Multivariate bernoulli distribution


var B = function () {

  // Number of learning steps. Real, not int.
  this.n = 0;

  // Total number of events
  this.sum = 0;

  // Number of event occurences
  this.w = {};

};


B.prototype.learn = function (evs, amount) {
  // Parameters
  //   evs
  //     a set of events (array of strings)
  //   amount (optional)
  //     length of step. Default to 1.

  var i, massPerEv;
  var massSum = 0;

  if (typeof amount !== 'number') {
    amount = 1;
  }

  if (amount === 0) {
    // No learning to be done.
    return;
  }

  // 6 events during 2-length step:
  // Total event mass would be 12.
  if (evs.length !== 0) {
    massPerEv = amount;
  } else {
    massPerEv = 1;
  }

  for (i = 0; i < evs.length; i += 1) {
    if (this.w.hasOwnProperty(evs[i])) {
      this.w[evs[i]] += massPerEv;
    } else {
      this.w[evs[i]] = massPerEv;
    }
    this.sum += massPerEv;
  }

  this.n += amount;
};


B.prototype.prob = function (ev) {
  // Probability that ev is in a step.
  // Gives probability p = N(x) / (N(x) + N(not_x))
  // Where N(x) is number of observations of x.
  // Note that here prob(x) + prob(y) can be greater than 1.0.

  if (this.w.hasOwnProperty(ev)) {
    if (this.n > 0) {
      return this.w[ev] / this.n;
    }
  }
  return 0;
};


B.prototype.sample = function () {
  // Return a set of events.

  var s = [];

  var ev, r;
  for (ev in this.w) {
    if (this.w.hasOwnProperty(ev)) {
      r = Math.random();
      if (r < this.prob(ev)) {
        // Include into sample
        s.push(ev);
      }
    }
  }

  return s;
};


module.exports = B;
