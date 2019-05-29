var INIT_COMP = 0.5;

module.exports = function (key, sortedSet) {
  // Return a number between 0..1 so that the higher the rank,
  // the closer the number to 1. The key with the highest value will
  // have weight of 1.0.
  //
  // Parameters:
  //   key
  //     A key in a sorted set.
  //   sortedSet
  //     A redis sorted set
  //
  var n = sortedSet.length;

  if (n === 0) {
    return INIT_COMP;
  }

  if (!sortedSet.has(key)) {
    return INIT_COMP;
  }

  // Normalize reward between the highest and lowest rewards
  var rew = sortedSet.score(key);
  var min = sortedSet.range(0, 0, { withScores: true })[0][1];
  var max = sortedSet.range(-1, -1, { withScores: true })[0][1];

  if (max === min) {
    return INIT_COMP;
  }

  var norm = (rew - min) / (max - min);

  // However, in the beginning, the competences would be
  // quite arbitrary. To avoid artefacts due to competence,
  // give 0.5 to all at the beginning and
  // gradually change to normalized.
  var ratio = 1 / Math.sqrt(n);

  // n = 1 => ratio = 1.0 => competence = 0.5
  // n = 2 => ratio = 0.7
  // n = 4 => ratio = 0.5

  // Weighted average
  return (ratio * INIT_COMP) + ((1 - ratio) * norm);
};
