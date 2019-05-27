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
// probability (history, pattern)
// mutualInformation (history, patternA, patternB)
// pointwiseMutualInformation (history, patternA, patternB)

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
  const priorSum = way.reduce(prior, (acc, q) => acc + q, 0)

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

  // Merge the predictions of the patterns.
  // The values without any support from the patterns should
  // be predicted by the prior distribution.
  // TODO How to mix prior with the predicted?
  // Naive try: sum up the masks and invert the values.
  // Add prior probabilities masked with these values to the result.

  // // Add information gains together
  // let mergedMask = way.create(width, len, 0)
  // mergedMask = way.reduce(firstPatterns, (acc, patt, c, t) => {
  //   return way.add(acc, patt.mask)
  // }, mergedMask)
  //
  // const mergedMaskMax = way.max(mergedMask)
  //
  // // Add probabilities together
  // let mergedValues = way.create(width, len, 0)
  // mergedValues = way.reduce(firstPatterns, (acc, patt, c, t) => {
  //   return way.add(acc, way.multiply(patt.values, patt.mask))
  // }, mergedValues)
  //
  // // Normalise values
  // // const scaledMergedValues = way.scale(mergedValues, 1 / mergedMaskMax)
  //
  // const mergedMaskNegative = way.map(mergedMask, q => mergedMaskMax - q)
  //
  // const prior = way.mean(history)
  // const priorValues = way.map(mergedValues, (q, c) => prior[c][0])
  // const priorValuesMasked = way.multiply(priorValues, mergedMaskNegative)
  //
  // const combinedValues = way.add(priorValuesMasked, mergedValues)
  // const normCombValues = way.scale(combinedValues, 1 / mergedMaskMax)
  //
  //
  //
  // return normCombValues
}
