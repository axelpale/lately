//
// Models any discrete distribution, not necessarily a prob distribution.
//

var D = function (d) {
  // Parameters:
  //   d (optional)
  //     a raw distribution {}

  this.w = {};
  this.sum = 0;

  if (typeof d === 'object') {
    this.add(d);
  }
};

D.prototype.add = function (ev, amount) {
  // Parameters:
  //   ev
  //     event id
  //   amount (optional, default 1)
  //     number of weight to add

  if (typeof amount !== 'number') {
    amount = 1;
  }

  if (this.w.hasOwnProperty(ev)) {
    this.w[ev] += amount;
  } else {
    this.w[ev] = amount;
  }

  this.sum += amount;
};

D.prototype.addDist = function (dist) {
  // Directly add to distribution weights
  //
  // Parameters:
  //   dist
  //     a raw distribution {}

  var k;
  for (k in dist) {
    if (dist.hasOwnProperty(k)) {
      if (this.w.hasOwnProperty(k)) {
        this.w[k] += dist[k];
      } else {
        this.w[k] = dist[k];
      }
      this.sum += dist[k];
    }
  }
};

D.prototype.clone = function () {
  // TODO optimize by writing it open. No need to recompute sum.
  var c = new D();
  c.addDist(this.w);
  return c;
};

D.prototype.get = function (ev) {
  // Return the current weight of ev.

  var w = this.w[ev];

  if (typeof w === 'undefined') {
    return 0;
  }

  return w;
};

module.exports = D;
