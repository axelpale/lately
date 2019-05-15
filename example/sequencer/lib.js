exports.zeros = (n) => {
  return new Array(n).fill(0);
}

exports.arrayScale = (arr, mult) => {
  return arr.map(x => x * mult);
}

exports.arrayMultiply = (a, b) => {
  return a.map((x, i) => x * b[i]);
}

exports.arrayAdd = (a, b) => {
  return a.map((x, i) => x + b[i]);
}

exports.arrayNor = (a, b) => {
  return a.map((x, i) => x === b[i] ? 1 : 0)
}

exports.arraySum = (a) => {
  return a.reduce((acc, x) => acc + x, 0);
}

exports.arrayRound = (arr) => {
  return arr.map(x => Math.round(x));
}

exports.multiScale = (multi, multiplier) => {
  // Scale a multi-channel time slice.
  return multi.map(channel => exports.arrayScale(channel, multiplier));
};

exports.multiAdd = (a, b) => {
  // Element-wise multi-channel addition.
  return a.map((chana, i) => {
    const chanb = b[i];
    return exports.arrayAdd(chana, chanb);
  });
};

exports.multiRound = (multi) => {
  return multi.map(channel => exports.arrayRound(channel));
};

exports.validate = (hist, t, size) => {
  if (typeof hist !== 'object') { throw new TypeError('history'); }
  if (typeof t !== 'number') { throw new TypeError('time'); }
  if (typeof size !== 'number') { throw new TypeError('size'); }
};

exports.pastSingle = (hist, t, size) => {
  // Single channel past
  //
  exports.validate(hist, t, size);

  let pre = [];
  if (t - size < 0) {
    pre = exports.zeros(Math.min(-t + size, size));
  }

  let lower = Math.max(0, Math.min(hist.length, t - size));
  let upper = Math.max(0, Math.min(hist.length, t));
  let mem = hist.slice(lower, upper);

  let post = [];
  if (t >= hist.length) {
    post = exports.zeros(Math.min(t - hist.length, size));
  }

  return pre.concat(mem, post);
};

exports.futureSingle = (hist, t, size) => {
  // Single channel future
  //
  exports.validate(hist, t, size);

  let pre = [];
  if (t < 0) {
    pre = exports.zeros(Math.min(-t, size));
  }

  let lower = Math.max(0, Math.min(hist.length, t));
  let upper = Math.max(0, Math.min(hist.length, t + size));
  let mem = hist.slice(lower, upper);

  let post = [];
  if (t + size >= hist.length) {
    post = exports.zeros(Math.min(t + size - hist.length, size));
  }

  return pre.concat(mem, post);
};
