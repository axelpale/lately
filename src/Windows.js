
var Categorical = require('./Categorical');
var math = require('mathjs');

// Constructor

var W = function (n) {

  // Windows
  this.ws = [];

  // Initialize windows and give them width by feeding 'void' event.
  var i;
  for (i = 0; i < n; i += 1) {
    this.ws[i] = new Categorical();
    this.ws[i].addMass({
      'void': Math.pow(2, i),
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

  var i;

  // Collect distributions and substract them by mass.
  // Do not collect and substract from the last one. The last one
  // works as catch all categorical dist.
  for (i = 0; i < this.ws.length - 1; i += 1) {
    forwards[i] = this.ws[i].getProbDist();
    this.ws[i].substractMass(forwards[i]);
  }

  // Add the mass to next windows
  for (i = 1; i < this.ws.length; i += 1) {
    this.ws[i].addMass(forwards[i - 1]);
  }

  // Teach the new event to the first window.
  this.ws[0].learn(ev);
};

W.prototype.getActiveEventVectors = function () {
  // Return active event vectors as array of arrays.
  // For each window, collect event vectors.
  return this.ws.reduce(function (acc, w, index) {
    var evs = w.eventsWithMassAbove(1.0);

    // Covert to eventVectors before array concatenation
    return acc.concat(evs.map(function (ev) {
      return [index, ev];
    }));
  }, []);
};

W.prototype.samplePattern = function () {
  // Pick one pattern randomly from the context.
  // A pattern consists of one atomic pattern, atom.
  // One atom is a certain event in a certain window.

  var i = math.randomInt(0, this.ws.length);
  var w = this.ws[i];
  var ev = math.pickRandom(w.events());

  var a = new Atom(i, ev);
  return new Pattern(a);
};

module.exports = W;
