

var C = function (initialEventArray, initialDelayArray) {
  // Remember the whole sequence
  this.seq = [];

  // precompute and store delay sums instead of delays
  // during insertion.
  this.times = [];

  // Mapping from id to array of positions of the id in
  // the sequence.
  this.index = {};

  if (typeof initialEventArray === 'object' &&
      typeof initialDelayArray === 'object') {
    this.push(initialEventArray, initialDelayArray);
  }
};

C.prototype.delaysBetween = function (a, b) {

  // Example:
  //
  // Seq Index    0 1 2 3     6   8 9         14   17 18  20
  // Event name   a a a b c c a c b a c c c c a c c b a c b
  // Event delay  1 1 1 1 1 1 1 1 6 1 1 1 1 1 1 1 1 1 1 3 1
  // A-B              ---     -----           ------- -----
  // A-B delays        1       1+6             1+1+1   3+1
  //
  // > distancesBetween(a, b);
  // [1, 7, 3, 4]

  var aIndices = this.index[a];
  var bIndices = this.index[b];

  if (typeof aIndices === 'undefined' ||
      typeof bIndices === 'undefined') {
    return [];
  }

  // Indices are already in order from smallest to largest.

  var curPos = {
    a: 0,  // index in aIndices. Value at this index is current max
    b: 0,
  };

  var ax, bx, axp1;

  // Array of pairs, indices of shortest A-B's
  var axbx = [];

  while (curPos.a < aIndices.length || curPos.b < bIndices.length) {
    ax = aIndices[curPos.a];
    bx = bIndices[curPos.b];
    if (ax < bx) {
      if (curPos.a + 1 < aIndices.length) {
        axp1 = aIndices[curPos.a + 1];
        if (axp1 < bx) {
          // Thus, ax is not the closest to bx.
          // Jump to next a
          curPos.a += 1;
        } else {
          // There is no another a between ax and bx;
          axbx.push([ax, bx]);
          curPos.a += 1;
          curPos.b += 1;
        }
      } else {
        // Then ax is the last one and before b.
        axbx.push([ax, bx]);
        curPos.a += 1; // will end the loop
        curPos.b += 1;
      }
    } else {
      // Thus ax after bx
      curPos.b += 1;
    }
  }

  // Compute delays between indices.
  return axbx.map(function (ab) {
    return this.times[ab[1]] - this.times[ab[0]];
  }, this);
};

C.prototype.push = function (ev, delay) {
  // Parameters:
  //   ev
  //     event id or array of event ids
  //   delay
  //     seconds from previous event or array of seconds

  if (typeof ev === 'object') {
    return ev.map(function (eve, i) {
      return this.push(eve, delay[i]);
    }, this);
  }

  this._push(ev, delay);
  this._index(ev);
};

C.prototype.size = function () {
  return this.seq.length;
};

C.prototype._push = function (ev, delay) {
  var prevTime;
  this.seq.push(ev);

  if (this.times.length === 0) {
    this.times.push(delay);
  } else {
    prevTime = this.times[this.times.length - 1];
    this.times.push(prevTime + delay);
  }
};

C.prototype._index = function (ev) {

  var arrayOfIndicesForEv = this.index[ev];
  var evIndex = this.seq.length - 1;

  if (typeof arrayOfIndicesForEv === 'undefined') {
    this.index[ev] = [evIndex];
  } else {
    this.index[ev].push(evIndex);
  }

};

module.exports = C;
