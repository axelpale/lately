
var Windows = require('./Windows');
var Hypos = require('./Hypos');

var W = 16;  // Number of windows

var X = function (hil) {
  // Parameters:
  //   hil
  //     higher layer

  if (hil) {
    this.hil = hil;
  } else {
    this.hil = null;
  }

  this.h = new Hypos();
  this.ws = new Windows(W);
};

X.prototype.feed = function (ev) {

  // Get active hypos.
  var evecs = this.ws.getActiveEventVectors();

  // Reward the correct hypos. Weight the reward by their prior.
  // Record active hypos for normalizing prior.
  var rewardCat = this.h.learn(evecs, ev);

  // Push event, move windows.
  // This causes change in the active set of hypos.
  this.ws.feed(ev);

  // Emit correct predictions as higher events.
  if (this.hil) {
    var hypohash = rewardCat.mode();
    var hiEv = hypohash + '//' + ev;
    this.hil.feed(hiEv);
  }
};

X.prototype.predict = function () {

  var evecs = this.ws.getActiveEventVectors();

  if (this.hil) {
    // Support hypos that previously predicted correctly a event and caused
    // the event on higher layer that is now predicted by the higher layer.
    var predHiEvDist = this.hil.predict();

    // Map HiEvs names to hypohashes
    var hypohashDist = Object.keys(predHiEvDist).reduce(function (acc, k) {
      var arr = k.split('//');
      var hypohash = arr.slice(0, -1).join('//');
      var val = predHiEvDist[k];
      acc[hypohash] = val;
      return acc;
    }, {});

    this.h.predict(evecs, hypohashDist);
  } else {
    this.h.predict(evecs);
  }
};


module.exports = X;
