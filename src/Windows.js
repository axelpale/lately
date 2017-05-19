
var Categorical = require('./Categorical');


var hash = function (evec) {
  // Hash event vector
  return evec.join('/');
};


// Constructor

var W = function (sizes) {
  // Parameters:
  //   sizes
  //     an array of window sizes. The first element gives the size
  //     to the first window, second to second et cetera.

  // Windows
  this.ws = [];

  // Window sizes
  this.sizes = sizes.slice(0);

  // Initialize windows.
  // A window has a size. Window accommodates this many events.
  var i;
  for (i = 0; i < sizes.length; i += 1) {
    this.ws[i] = new Categorical();
  }
};

// Private methods


// Public methods

W.prototype.feed = function (ev) {

  // Push distributions forward.

  var i, sample;

  // Move a sample into next window. A kind of fuzzy queue.
  // The sample from the last window is not moved but forgotten.
  // Do for each window, last window first.
  for (i = this.ws.length - 1; i >= 0; i -= 1) {

    sample = this.ws[i].sample();

    // Move (unlearn, then learn) samples only from full windows.
    if (this.ws[i].weightSum() >= this.sizes[i]) {
      this.ws[i].unlearn(sample);  // Remove samples's worth of mass.

      // Sample is tought to next window.
      if (i < this.ws.length - 1) {
        this.ws[i + 1].learn(sample);  // Add samples's worth of mass.
      }
    }

  }

  // Teach the new event to the first window.
  this.ws[0].learn(ev);  // Add one's worth of mass.
};

W.prototype.getNumberOfWindows = function () {
  return this.ws.length;
};

W.prototype.getWindow = function (index) {
  return this.ws[index];
};

W.prototype.getActive = function () {
  // Active conditions.
  //
  // Returns
  //  array of active context events.

  // For each window, collect event vectors, and then push them
  // into single array.
  return this.ws.reduce(function (acc, w, index) {
    var evs = w.eventsWithMassAbove(0.9);

    // Covert to eventVectors before array concatenation
    return acc.concat(evs.map(function (ev) {
      return hash([index, ev]);  // an event vector to context event
    }));
  }, []);
};

W.prototype.inspect = function () {
  var self = this;

  return self.ws.map(function (b, index) {
    return {
      index: index,
      mass: b.mass(),
      massTarget: self.sizes[index],
      events: b.w,
    };
  });
};

module.exports = W;
