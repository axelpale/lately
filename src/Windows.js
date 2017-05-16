
var Bernoulli = require('./Bernoulli');
var fibonacci = require('./lib/fibonacci');
var math = require('mathjs');

// Constructor

var W = function (n) {

  // Windows
  this.ws = [];

  // Initialize windows.
  // A window has a size. Window accommodates this many events.
  // Each window has a constant designed size, which ramp up
  // in fibonacci manner: first and second window have size of 1,
  // third 2, fourth 3, fifth 5 et cetera.
  // This presumably is a natural growth ratio for temporal
  // fuzzyness.
  var i;
  for (i = 0; i < n; i += 1) {
    this.ws[i] = new Bernoulli();
  }
};

// Private methods


// Public methods

W.prototype.getNumberOfWindows = function () {
  return this.ws.length;
};

W.prototype.getWindow = function (index) {
  return this.ws[index];
};

W.prototype.feed = function (evs) {

  // Push distributions forward.

  var i, sample;

  // Move a sample into next window. A kind of fuzzy queue.
  // The sample from the last window is not moved but forgotten.
  // Do for each window, last window first.
  for (i = this.ws.length - 1; i >= 0; i -= 1) {

    sample = this.ws[i].sample();

    // Move (unlearn then learn) samples only from full windows.
    if (this.ws[i].weightSum() >= fibonacci(i + 1)) {
      this.ws[i].unlearn(sample);  // Remove samples's worth of mass.

      // Sample is tought to next window.
      if (i < this.ws.length - 1) {
        this.ws[i + 1].learn(sample);  // Add samples's worth of mass.
      }
    }

  }

  // Teach the new event to the first window.
  this.ws[0].learn(evs);  // Add one's worth of mass.
};

W.prototype.getActive = function () {
  // Event vector is an array of values that make the event unique.
  // Returns
  //  active event vectors as array of arrays.

  // For each window, collect event vectors, and then push them
  // into single array.
  return this.ws.reduce(function (acc, w, index) {
    var evs = w.eventsWithMassAbove(0.9);

    // Covert to eventVectors before array concatenation
    return acc.concat(evs.map(function (ev) {
      return [index, ev];  // an event vector
    }));
  }, []);
};

module.exports = W;
