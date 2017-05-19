
var Windows = require('./Windows');

// Each window has a constant designed size, which ramp up
// in fibonacci manner: first and second window have size of 1,
// third 2, fourth 3, fifth 5 et cetera.
// This presumably is a natural growth ratio for temporal
// fuzzyness.
var WINDOW_SIZES = [1, 1, 2, 3, 5, 8, 13, 21]

// Constructor

var CX = function () {

  // Windows
  this.ws = new Windows(WINDOW_SIZES);
};

// Private methods


// Class variables

CX.ANY = 'any';


// Public methods

CX.prototype.feed = function (ev) {

  // Push event, move windows.
  // This causes change in the active context.
  this.ws.feed(ev);
};

CX.prototype.getActive = function () {
  // Active conditions.
  //
  // Returns
  //  array of strings.

  // Active events from event history
  var cevs = this.ws.getActive();

  // Any-condition. This leads to creation of a hypo for any condition,
  // kind of prior probability distribution of events.
  cevs.push(CX.ANY);

  return cevs;
};

module.exports = CX;
