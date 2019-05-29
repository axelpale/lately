
module.exports = function (opts, def) {
  // Returns an extended clone of opts.
  //
  // Parameters
  //   opts
  //     object to extend
  //   def
  //     default values

  if (typeof opts !== 'object') {
    return def;
  }

  var k;
  var result = {};

  // Clone
  for (k in opts) {
    if (opts.hasOwnProperty(k)) {
      result[k] = opts[k];
    }
  }

  // Fill in missing values
  for (k in def) {
    if (def.hasOwnProperty(k)) {
      if (!result.hasOwnProperty(k)) {
        result[k] = def[k];
      }
    }
  }

  return result;
};
