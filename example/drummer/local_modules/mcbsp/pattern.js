const way = require('senseway')

exports.averageContext = (history, values, mask) => {
  // Sum over history
  //
  // Params:
  //   history, a way. Full history where to search the pattern.
  //   values, a way. Values for the pattern.
  //   mask, a way. Which values of the pattern are meaningful
  //

  if (way.len(values) !== way.len(mask)) {
    throw new Error('Way length mismatch. Values and mask must be same size.')
  }

  // Lengths
  const len = way.len(mask)
  const hlen = way.len(history)

  // Compute mask mass to compare later how perfectly a time slice matches.
  const maskMass = way.reduce(mask, (acc, q) => acc + q, 0)

  // We add up the matching parts of the history to see what
  // happens around the pattern. Let us init the sum with zeros.
  let sliceSum = way.map(mask, q => 0)
  let supportSum = 0

  for (let t = -len; t < hlen; t += 1) {
    // Take a slice of history at time t.
    let tslice = way.slice(history, Math.max(0, t), t + len)
    // A mask for this t.
    let tmask = mask

    // We do not want bias near the edges.
    // Deal with the edges by padding the slice so that size matches the mask.
    // The equal sizes are needed for math operations.
    // However we do not want the padded values have any weight.
    // Therefore we mask the padded values out
    // by setting this area in mask to zero.
    if (t < 0) {
      // Pad at begin
      tslice = way.padLeft(tslice, len, 0)
      tmask = way.padLeft(way.slice(tmask, -t, len), len, 0)
      // For example, with mask length 4:
      //   t = -4: padLeft(slice(tmask, 4, 4), 4, 0)
      //   t = -2: padLeft(slice(tmask, 2, 4), 4, 0)
      //   t = 0: padLeft(slice(tmask, 0, 4), 4, 0)
    } else if (t > hlen - len) {
      // For example, len = 4, hlen = 8:
      //   t = 4: 4 > 8 - 4 === false
      //   t = 5: 5 > 8 - 4 === true

      // Pad at end
      tslice = way.padRight(tslice, len, 0)
      tmask = way.padRight(way.slice(tmask, 0, hlen - t), len, 0)
      // For example, len = 4, hlen = 8:
      //   t = 5: padRight(slice(tmask, 0, 3), 4, 0)
      //   t = 7: padRight(slice(tmask, 0, 1), 4, 0)
      //   t = 8: padRight(slice(tmask, 0, 0), 4, 0)
    }

    // Compute how much the slice resembles the pattern.
    // 0 & 0 => 1
    // 0 & 1 => 0
    // 1 & 1 => 1
    // 0.5 & 0.5 => 1
    const match = way.map2(values, tslice, (a, b) => 1 - Math.abs(a - b))
    // Mask out those resemblances that are not part of the pattern.
    // We do not care about them.
    const masked = way.map2(match, tmask, (d, m) => d * m)
    // Measure how much the slice resembles the pattern
    // by summing up the matches after masking.
    let support = way.reduce(masked, (acc, q) => acc + q, 0)
    // If the pattern exists in the slice, support is high.
    // To make the existence test more crispier, use only perfect matches.
    if (support < maskMass) {
      support = 0
    }
    // Lets add up the supporting slices by taking
    // a weighted average of the slices.
    const weightedSlice = way.scale(tslice, support)
    sliceSum = way.add(sliceSum, weightedSlice)
    supportSum = supportSum + support
  }

  // Normalise to get the weighted average.
  // Take care of possible division by zero.
  let sliceAverage = way.scale(sliceSum, supportSum > 0 ? 1 / supportSum : 0)

  // If sum of support is 0, there is absolutely no matching pattern.
  // Then we just need to use our best knowledge, a priori.
  if (supportSum === 0) {
    const prior = way.mean(history)
    sliceAverage = way.map(sliceAverage, (zero, c) => prior[c][0])
    // TODO way.repeat(way.mean(history), way.len(sliceAverage))
  }

  return sliceAverage
}

// TODO
// mutualInformation (history, patternA, patternB)
// pointwiseMutualInformation (history, patternA, patternB)

const findMatches = (history, pattern) => {
  // Times where the pattern can be found from the history.
  //
  // Parameters:
  //   history
  //   pattern: { values, mask }
  //
  // NOTE: Best results when the pattern is tight i.e. way.trim has no effect.

  const vals = pattern.values
  const mask = pattern.mask
  const len = way.len(pattern.mask)
  const hlen = way.len(history)
  const width = way.width(history)

  // Collect times in history here
  const times = []

  // For each point in time
  for (let ht = 0; ht < hlen - len + 1; ht += 1) {
    let match = true
    // For each cell in pattern
    for (let c = 0; match && c < width; c += 1) {
      for (let t = 0; match && t < len; t += 1) {
        if (mask[c][t] > 0.5) {
          if (history[c][ht + t] !== vals[c][t]) {
            match = false
          }
        }
      }
    }
    // Note if pattern is empty, match === true
    if (match) {
      times.push(ht)
    }
  }

  return times
}

const maxNumOfMatches = (history, pattern) => {
  // If the pattern would match at every t, how many matches it would yield.
  //
  // For example:
  //   4-frame history, 1-frame pattern => max 4
  //   4-frame history, 2-frame pattern => max 3

  // Take care of case where pattern is longer than history.
  return Math.max(0, way.len(history) - way.len(pattern.mask) + 1)
}

const informationGain = (prior, posterior) => {
  // Parameters:
  //   prior
  //     Prior probabilities. Probs for a slice before knowledge about an event.
  //   posterior
  //     Posterior probabilities. Probs for a slice given the event.
  //
  // Returns:
  //   a way, having same sizes as the posterior, where every element
  //   equals the number of bits the event gave about the value of the element.
  //
  // Each element in the average slice tells us the probability of value 1
  // happening on that same position next to where the pattern exists.
  // In other words, the average slice gives the probability distribution
  // given the pattern. This distribution can be used for prediction.

  // However, it does not directly reveal the statistical dependecies between
  // the elements and the pattern. For example, consider a dependent element
  // that occurs rarely and compare it to an independent element (given
  // the pattern) that occurs often. The latter will have higher probability
  // in the average slice.

  // To map the dependencies between elements (i.e. events; random variables)
  // we take into account their probability in general, a priori.
  // If the probability of an element in the avg slice differs from a priori,
  // then the pattern and the element are dependent.

  const gain = way.map(posterior, (pr, c) => {
    // pr = probability of x given y, where y is our pattern
    // pri = probability of x in general
    // NOTE a little bias in prior caused by the edges.
    const pri = prior[c][0]
    // Kullback-Leibler divergence
    const x0 = (pr === 1) ? 0 : (1 - pr) * Math.log2((1 - pr) / (1 - pri))
    const x1 = (pr === 0) ? 0 : pr * Math.log2(pr / pri)
    return x0 + x1
  });

  return gain
}

exports.dependent = (history, values, mask) => {
  const averageContext = exports.averageContext(history, values, mask)
  const prior = way.mean(history)
  return informationGain(prior, averageContext)
}

exports.firstOrderPatterns = (history, patternLen) => {
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

    const avgZero = exports.averageContext(history, zeros, mask)
    const depZero = informationGain(prior, avgZero)
    const avgOne = exports.averageContext(history, ones, mask)
    const depOne = informationGain(prior, avgOne)

    return [
      // Pattern for 0
      {
        source: {
          values: zeros,
          mask: mask
        },
        values: avgZero,
        mask: depZero
      },
      // Pattern for 1
      {
        source: {
          values: ones,
          mask: mask
        },
        values: avgOne,
        mask: depOne
      }
    ]
  })
}

exports.firstOrderPredict = (history, context, distance) => {
  const width = way.width(context)
  const len = way.len(context) + distance
  const firstOrder = exports.firstOrderPatterns(history, len)

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

const secondOrderMasks = (width, len) => {
  // Find every 2nd-order pattern within the context.
  // We only need to create masks, context provides the values.
  const masks = []

  for (let ca = 0; ca < width; ca += 1) {
    for (let ta = 0; ta < len; ta += 1) {
      for (let cb = ca; cb < width; cb += 1) {
        for (let tb = ta; tb < len; tb += 1) {
          // Prevent first order masks
          if (ca !== cb || ta !== tb) {
            let mask = way.create(width, len, 0)
            mask[ca][ta] = 1
            mask[cb][tb] = 1
            masks.push(mask)
          }
        }
      }
    }
  }

  return masks
}

exports.secondOrderPatterns = (history) => {

  const width = way.width(history)
  const hlen = way.len(history)
  const len = 2 // TODO
  const context = way.last(history, len)
  const prior = way.mean(history)

  const masks = secondOrderMasks(width, len)

  return masks.map(mask => {
    const patt = {
      values: context,
      mask: mask
    }
    const times = findMatches(history, patt)
    const maxTimesLength = maxNumOfMatches(history, patt)
    const patternProbability = times.length / maxTimesLength

    const slices = times.map(t => {
      return way.slice(history, t, t + len)
    })
    const avgSlice = way.average(slices)
    const gainToPrior = informationGain(prior, avgSlice)

    return {
      pattern: patt,
      prob: patternProbability,
      average: avgSlice,
      gain: gainToPrior
    }
  })
}

exports.secondOrderPredict = () => {
  // For every found pattern, compute:
  // - number of occurrences in the history (prior for the pattern)
  // - average around the pattern
  // - deviation from base prior probabilities (dependent)
  // - how much the average differs from the context in general
  // - how much the average of dependent differs from the context
}