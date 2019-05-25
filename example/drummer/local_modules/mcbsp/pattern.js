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

const dependent = (history, averageContext) => {
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
  const prior = way.mean(history)
  const priorSum = way.reduce(prior, (acc, q) => acc + q, 0)

  const gain = way.map(averageContext, (pr, c) => {
    // pr = probability of x given y, where y is our pattern
    // pri = probability of x in general
    // NOTE little bias in prior caused by the edges.
    const pri = prior[c][0]
    // Kullback-Leibler divergence
    const x0 = (pr === 1) ? 0 : (1 - pr) * Math.log2((1 - pr) / (1 - pri))
    const x1 = (pr === 0) ? 0 : pr * Math.log2(pr / pri)
    return x0 + x1
  });

  // Weight the channels
  return gain
}

exports.dependent = (history, values, mask) => {
  const averageContext = exports.averageContext(history, values, mask)
  return dependent(history, averageContext)
}
