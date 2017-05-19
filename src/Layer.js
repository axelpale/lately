
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

X.prototype.feed = function (ev) {

  // Get context events.
  var cevs = this.cx.getActive();

  // Reward the correct hypos.
  this.hs.learn(cevs, ev);

  // Register the new event to context
  this.cx.feed(ev);

  // Emit correct predictions as higher events.
  // if (this.hil) {
  //   var hypohash = rewardCat.mode();
  //   var hiEv = hypohash + '//' + ev;
  //   this.hil.feed(hiEv);
  // }
};

X.prototype.predict = function () {

  var cevs = this.cx.getActive();
  return this.hs.predict(cevs);

  // if (this.hil) {
  //   // Support hypos that previously predicted correctly a event and caused
  //   // the event on higher layer that is now predicted by the higher layer.
  //   var predHiEvDist = this.hil.predict();
  //
  //   // Map HiEvs names to hypohashes
  //   var hypohashDist = Object.keys(predHiEvDist).reduce(function (acc, k) {
  //     var arr = k.split('//');
  //     var hypohash = arr.slice(0, -1).join('//');
  //     var val = predHiEvDist[k];
  //     acc[hypohash] = val;
  //     return acc;
  //   }, {});
  //
  //   this.h.predict(evecs, hypohashDist);
  // } else {
  //   this.h.predict(evecs);
  // }
};

X.prototype.inspect = function () {
  return {
    hypos: this.hs.inspect(),
    context: this.cx.inspect(),
  };
};


module.exports = X;
