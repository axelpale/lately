const averageContext = require('./averageContext')
const informationGain = require('./informationGain')
const way = require('senseway')

exports.patterns = (history, patternLen) => {
  const width = history.length
  const prior = way.mean(history)
  const zeros = way.create(width, patternLen, 0)
  const ones = way.create(width, patternLen, 1)

  // Precompute 1st order patterns.
  // For every channel get a pattern for single zero
  // and a pattern for single one.
  return history.map((ch, c) => {
    // Build mask by setting one cell to one.
    // Note that t=0, thus we get the avgContext
    // towards the future. TODO We might benefit
    // from past context too when weighting how
    // well the pattern matches the context.
    const mask = way.set(zeros, c, 0, 1)

    const avgZero = averageContext(history, zeros, mask)
    const gainZero = informationGain(prior, avgZero)
    const avgOne = averageContext(history, ones, mask)
    const gainOne = informationGain(prior, avgOne)

    return [
      // Pattern for 0
      {
        source: {
          values: zeros,
          mask: mask
        },
        values: avgZero,
        mask: gainZero
      },
      // Pattern for 1
      {
        source: {
          values: ones,
          mask: mask
        },
        values: avgOne,
        mask: gainOne
      }
    ]
  })
}

exports.predict = (history, context, distance) => {
  const width = way.width(context)
  const len = way.len(context) + distance
  const firstOrder = exports.patterns(history, len)

  // For every event in the context, select the first order pattern.
  // firstPatterns has dimensions of context.
  // Each element is a pattern { values, mask }.
  const firstPatterns = way.map(context, (q, c, t) => {
    const v = Math.round(q) // To deal with fuzzy binary TODO not needed?
    return Object.assign({
      timeOffset: t
    }, firstOrder[c][v])
  })

  // For each element in prediction we
  // choose the corresponding value from
  // the pattern that gave most information at this cell.
  // maxMask = find pattern where the mask has max value
  // includes area for the prediction.
  const prediction = way.map(way.create(width, len, 0), (q, c, t) => {
    // Find pattern that has the largest information gain for this cell.
    let maxGain = 0
    let valueOfMaxGain = 0 // TODO init from first
    way.each(firstPatterns, (patt) => {
      if (t - patt.timeOffset >= 0) {
        const prob = patt.values[c][t - patt.timeOffset]
        const gain = patt.mask[c][t - patt.timeOffset]

        if (gain > maxGain) {
          maxGain = gain
          valueOfMaxGain = prob
        }
      }
    })

    return valueOfMaxGain
  })

  return prediction
  // Alternative:
  // The values without any support from the patterns should
  // be predicted by the prior distribution.
  // How to mix prior with the predicted?
  //   Try: sum up the masks and invert the values.
  //   Add prior probabilities masked with these values to the result.
}
