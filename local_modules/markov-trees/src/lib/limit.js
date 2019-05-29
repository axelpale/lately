module.exports = function (x, min, max) {
  if (min < max) {
    return Math.min(Math.max(x, min), max);
  }
  return Math.min(Math.max(x, max), min);
};
