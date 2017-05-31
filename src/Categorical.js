// Categorical distribution

var limit = require('./lib/limit');
var distSum = require('./lib/distSum');
var assertDist = require('./lib/assertDist');


// Constructor

var Cat = function (d, amount) {
  // Parameters:
  //   d (optional)
  //     a distribution
  //   amount (optional)
  //     mass of the distribution

  this.w = {};
  this.sum = 0;

  if (typeof d === 'object') {
    this.learnDist(d, amount);
  }
};

// Class methods

Cat.createFromDiscrete = function (disc) {
  // Parameters:
  //   disc
  //     discrete distribution
  return new Cat(disc.w, disc.sum);
};


// Public methods

Cat.prototype.addMass = function (dist) {
  // Directly add to distribution weights

  var k;
  for (k in dist) {
    if (dist.hasOwnProperty(k)) {
      if (this.w.hasOwnProperty(k)) {
        this.w[k] += dist[k];
      } else {
        this.w[k] = dist[k];
      }
      this.sum += dist[k];
    }
  }
};


Cat.prototype.divergenceFrom = function (prior) {
  // Kullback-Leibler divergence D_kl(P||Q) in bits, where
  // P is this distribution and
  // Q is the given prior.
  //
  // Returns the information gained when switching from prior to this cat.

  var div = 0;

  prior.forEach(function (ev, pr) {
    var pi = this.prob(ev);
    div += pi * Math.log(pi / pr);
  }, this);

  // From nats to bits
  return div * Math.LOG2E;
};


Cat.prototype.entropy = function () {
  // Entropy in nats.
  var k, p;
  var sum = 0;
  for (k in this.w) {
    if (this.w.hasOwnProperty(k)) {
      p = this.w[k] / this.sum;
      sum += p * Math.log(p);
    }
  }
  return -sum;
};


Cat.prototype.events = function () {
  // Return a list of events with non-zero probability
  return Object.keys(this.w);
};


Cat.prototype.eventsWithMassAbove = function (minMass) {
  var self = this;
  return self.events().filter(function (ev) {
    return self.w[ev] > minMass;
  });
};


Cat.prototype.forEach = function (iteratee, ctx) {
  // Parameters:
  //   iteratee
  //     function (ev, probability)
  //   ctx (optional, default to undefined)
  //     iteratee's this value
  var k, p;
  for (k in this.w) {
    if (this.w.hasOwnProperty(k)) {
      p = this.w[k] / this.sum;
      iteratee.call(ctx, k, p);
    }
  }
};


Cat.prototype.getMassDist = function () {
  // Get distribution
  var d = {};

  var k;
  for (k in this.w) {
    if (this.w.hasOwnProperty(k)) {
      d[k] = this.w[k];
    }
  }

  return d;
};


Cat.prototype.getProbDist = function () {
  // Get distribution
  var d = {};

  var k;
  for (k in this.w) {
    if (this.w.hasOwnProperty(k)) {
      d[k] = this.w[k] / this.sum;
    }
  }

  return d;
};


Cat.prototype.has = function (ev) {
  return this.w.hasOwnProperty(ev);
};


Cat.prototype.learn = function (ev, amount) {
  // Parameters:
  //   ev
  //     string or distribution

  if (typeof ev === 'object') {
    this.learnDist(ev, amount);
    return;
  }

  if (typeof amount !== 'number') {
    amount = 1;
  }

  if (this.w.hasOwnProperty(ev)) {
    this.w[ev] += amount;
  } else {
    this.w[ev] = amount;
  }

  this.sum += amount;
};


Cat.prototype.learnDist = function (evDist, amount) {
  // Learn a distribution of events so that the total mass
  // raises by 'amount'

  assertDist(evDist);

  if (typeof amount !== 'number') {
    amount = 1;
  }

  var k, p;
  var sum = distSum(evDist);
  var psum = 0;  // psum stays 0 if evDist is empty.

  for (k in evDist) {
    if (evDist.hasOwnProperty(k)) {
      p = evDist[k] / sum;
      psum += p;

      if (this.w.hasOwnProperty(k)) {
        this.w[k] += p * amount;
      } else {
        this.w[k] = p * amount;
      }
    }
  }

  this.sum += psum * amount;
};


Cat.prototype.mass = function () {
  return this.sum;
};


Cat.prototype.mode = function () {
  // Return the category with the highest probability.

  var maxW = 0;
  var maxKey = null;
  var k;

  for (k in this.w) {
    if (this.w.hasOwnProperty(k)) {
      if (this.w[k] > maxW) {
        maxKey = k;
        maxW = this.w[k];
      }
    }
  }

  return maxKey;
};


Cat.prototype.prob = function (ev) {
  var raw;

  if (!this.w.hasOwnProperty(ev)) {
    return 0;
  }

  if (this.sum === 0) {
    raw = 0;
  } else {
    raw = this.w[ev] / this.sum;
  }

  // Ensure that rounding errors do not lead to non-probability values
  return limit(raw, 0.0, 1.0);
};


Cat.prototype.sample = function () {

  var r = Math.random();
  var sum = 0;

  var ev, p;
  for (ev in this.w) {
    if (this.w.hasOwnProperty(ev)) {
      p = this.w[ev] / this.sum;
      sum += p;
      if (r < sum) {
        return ev;
      }
    }
  }

  return null;
};


Cat.prototype.substractMass = function (dist) {
  // Directly substract from distribution weights

  var k;
  for (k in dist) {
    if (dist.hasOwnProperty(k)) {
      if (this.w.hasOwnProperty(k)) {
        if (this.w[k] - dist[k] < 0) {
          this.sum -= this.w[k];
          delete this.w[k];
        } else {
          this.w[k] -= dist[k];
          this.sum -= dist[k];
        }
      }
    }
  }
};


Cat.prototype.unlearn = function (ev, amount) {

  if (typeof amount !== 'number') {
    amount = 1;
  }

  if (this.w.hasOwnProperty(ev)) {
    if (this.w[ev] - amount > 0) {
      this.w[ev] -= amount;
      this.sum -= amount;
    } else {
      this.sum -= this.w[ev];
      delete this.w[ev];
    }
  }
};


Cat.prototype.weight = function (ev) {
  if (this.w.hasOwnProperty(ev)) {
    return this.w[ev];
  }
  return 0;
};


Cat.prototype.weightSum = function () {
  return this.sum;
};


module.exports = Cat;
