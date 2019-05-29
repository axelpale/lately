
var Context = require('./Context');
var Hypos = require('./Hypos');

var X = function () {
  // Parameters:
  //   hil
  //     higher layer

  // if (hil) {
  //   this.hil = hil;
  // } else {
  //   this.hil = null;
  // }

  this.cx = new Context();
  this.hs = new Hypos();
};

X.prototype.feed = function (evs) {
  // Parameters:
  //   evs
  //     array of event strings
  //
  // Return set of correct precitions

  var ev = evs[0];  // TODO

  // Get context events.
  var cevs = this.cx.getActive();

  // Reward the correct hypos.
  this.hs.learn(cevs, ev);

  // Register the new event to context
  this.cx.feed(ev);

  return [];  // TODO
};

X.prototype.predict = function (amplification) {
  // Parameters:
  //   amplification (optional)
  //     These predictions will be amplified.
  //     This is the way for higher layer to affect
  //     distributions below.

  var cevs = this.cx.getActive();
  return this.hs.predict(cevs, amplification);
};

X.prototype.inspect = function () {
  return {
    hypos: this.hs.inspect(),
    context: this.cx.inspect(),
  };
};


module.exports = X;
