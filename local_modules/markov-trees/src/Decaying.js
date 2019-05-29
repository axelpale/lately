// Decaying categorical distribution.
//
// Collects an exponentially decaying categorical probability distribution of
// the input events. At each learn step, weight of previous inputs is
// multiplied by m, a number between 0 and 1.
//
// Online learning

var distSum = require('./lib/distSum');
var limit = require('./lib/limit');


// Constants
////////////

var M_MIN = 0.01;
var M_MAX = 1.0;

// Minimum weight before removal.
var W_MIN = 0.0001;


// Constructor

var D = function (m) {
  // Parameters
  //   m
  //     decay multiplier
  //     0.0 => arrival time prediction, lifo
  //     1.0 => categorical distribution prediction
  //

  this.w = {};
  this.sum = 0;
  this.m = limit(m, M_MIN, M_MAX);
};

// Private methods


var forget = function (self, amount) {

  var m = Math.pow(self.m, amount);

  self.sum *= m;

  var k;
  for (k in self.w) {
    if (self.w.hasOwnProperty(k)) {
      self.w[k] *= m;

      if (self.w[k] < W_MIN) {
        delete self.w[k];
      }
    }
  }
};


// Public methods

D.prototype.getProbDist = function () {
  // Get probability distribution
  var d = {};

  var k;
  for (k in this.w) {
    if (this.w.hasOwnProperty(k)) {
      d[k] = this.w[k] / this.sum;
    }
  }

  return d;
};


D.prototype.has = function (ev) {
  return this.w.hasOwnProperty(ev);
};


D.prototype.learn = function (ev, amount) {

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

  forget(this, amount);
};


D.prototype.learnDist = function (evDist, amount) {

  if (typeof amount !== 'number') {
    amount = 1;
  }

  var k, p;
  var sum = distSum(evDist);
  var psum = 0;  // If evDist is empty, stays zero when added to sum.

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

  forget(this, amount);
};


D.prototype.mass = function () {
  return this.sum;
};


D.prototype.prob = function (ev) {
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

module.exports = D;
