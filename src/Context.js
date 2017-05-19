
var Windows = require('./Windows');

var NUM_WINDOWS = 16;


// Constructor

var CX = function () {

  // Windows
  this.ws = new Windows(NUM_WINDOWS);
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
