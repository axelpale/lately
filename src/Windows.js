
var Categorical = require('./Categorical');
var fibonacci = require('./lib/fibonacci');
var math = require('mathjs');

// Constructor

var W = function (n) {

  // Windows
  this.ws = [];

  // Initialize windows and give them width by feeding 'void' event.
  // Width is the constant number of events in the window.
  // Increase the width in fibonacci manner for natural growth.
  var i;
  for (i = 0; i < n; i += 1) {
    this.ws[i] = new Categorical();
    this.ws[i].addMass({
      'void': fibonacci(i + 1),  // 1, 1, 2, 3, 5, 8
    });
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

W.prototype.feed = function (ev) {

  // Push distributions forward by mass of one.
  var forwards = [];

  var i, sample;

  // Move single sample into next window. A kind of fuzzy queue.
  // The sample from the last window is not moved but forgotten.
  for (i = 0; i < this.ws.length; i += 1) {
    sample = this.ws[i].sample();
    forwards[i] = sample;
    this.ws[i].unlearn(sample);  // Remove one's worth of mass.
  }

  // Teach the new event to the first window.
  this.ws[0].learn(ev);  // Add one's worth of mass.

  // Propagate the events to next windows
  for (i = 1; i < this.ws.length; i += 1) {
    this.ws[i].learn(forwards[i - 1]);  // Add one's worth of mass
  }

  // Assert outcome: masses stay same.
};

W.prototype.getActiveEventVectors = function () {
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
