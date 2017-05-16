// Multivariate bernoulli distribution


var B = function () {

  // Number of learning steps. Real, not int.
  this.n = 0;

  // Total number of events
  this.sum = 0;

  // Number of event occurences
  this.w = {};

};


B.prototype.events = function () {
  // Return a list of events with non-zero probability
  return Object.keys(this.w);
};


B.prototype.eventsWithMassAbove = function (minMass) {
  var self = this;
  return self.events().filter(function (ev) {
    return self.w[ev] > minMass;
  });
};


B.prototype.learn = function (evs, amount) {
  // Parameters
  //   evs
  //     a set of events (array of strings)
  //   amount (optional)
  //     length of step. Default to 1.

  var i, massPerEv;
  var massSum = 0;

  if (typeof evs === 'string') {
    evs = [evs];
  }

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


B.prototype.prob = function (evs) {
  // Estimated probability that evs are in the next step.
  //
  // Let X, Y be independent events. Then P(X and Y) = P(X) * P(Y),
  // where P(X) = N(X) / N.
  // N(X) is number of observations of X.
  //
  // Note that here prob(['x']) + prob(['y']) can be greater than 1.0.
  var i, ev;
  var product = 1;

  if (typeof evs === 'string') {
    evs = [evs];
  }

  if (this.n === 0) {
    return 0;
  }

  for (i = 0; i < evs.length; i += 1) {
    ev = evs[i];
    if (this.w.hasOwnProperty(ev)) {
      product = product * (this.w[ev] / this.n);
    } else {
      product = 0;
    }
  }

  if (evs.length === 0) {
    // Probability of no evs in the next step.
    // P(noX and noY)
    //   = P(noX) * P(noY)
    //   = (1 - P(X)) * (1 - P(Y))
    //   = (1 - N(X) / N) * (1 - N(Y) / N)
    for (ev in this.w) {
      if (this.w.hasOwnProperty(ev)) {
        product = product * (1 - this.w[ev] / this.n);
      }
    }
  }

  return product;
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


B.prototype.unlearn = function (evs, amount) {
  // Parameters
  //   evs
  //     a set of events (array of strings)
  //   amount (optional)
  //     length of step. Default to 1.

  var i, ev, massPerEv;
  var massSum = 0;

  if (typeof evs === 'string') {
    evs = [evs];
  }

  if (typeof amount !== 'number') {
    amount = 1;
  }

  if (amount === 0) {
    // No unlearning to be done.
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
    ev = evs[i];
    if (this.w.hasOwnProperty(ev)) {
      if (this.w[ev] > massPerEv) {
        this.w[ev] -= massPerEv;
        this.sum -= massPerEv;
      } else {
        this.sum -= this.w[ev];
        delete this.w[ev];
      }
    }
  }

  this.n -= amount;
};


B.prototype.weight = function (ev) {
  if (this.w.hasOwnProperty(ev)) {
    return this.w[ev];
  }
  return 0;
};


B.prototype.weightSum = function () {
  return this.sum;
};


module.exports = B;
