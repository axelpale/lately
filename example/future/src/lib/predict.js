const pat = require('sensepat')

module.exports = (historyValues, historyMask, channel, time) => {
  // Find probability for 1 in the given cell position,
  // given the history.
  //
  // Params
  //   ...
  //
  // Returns
  //   probability for 1
  //

  // Algorithm:
  //
  // Find informative patterns from neighborhood
  // Find how each pattern affected similar position in history.
  // Find prior probability for each pattern.
  // Find prior probability for the position.

  // Make into a sensepat
  const hist = pat.pattern(historyValues, historyMask)

  // 0th order prediction: channel expectance
  const prior = pat.mean(hist)
  return prior[channel]
}
