const way = require('senseway')
const patmean = require('./mean')

module.exports = (history, pattern) => {
  // Sum over places in history where the pattern exists.
  //
  // Params:
  //   history, a pat. Full history where to search the pattern.
  //   pattern, a pat. The pattern to find.
  //

  // Short alias
  const H = history
  const P = pattern

  if (way.len(P.value) !== way.len(P.mass)) {
    throw new Error('Way length mismatch. Value and mass must be same size.')
  }

  // Lengths
  const len = way.len(P.value)
  const hlen = way.len(H.value)

  // Channel means
  const prior = patmean(history)

  // Compute mass sum to compare later how perfectly a time slice matches.
  const massSum = way.sum(P.mass)

  // We will add up the matching parts of the history to see what
  // happens around the pattern. Let us init the sum with zeros.
  let contextSum = way.map(P.value, q => 0)
  let supportSum = way.map(P.value, q => 0)

  for (let t = -len; t < hlen; t += 1) {
    // Take a slice of history at time t.
    let tHistValue = way.slice(H.value, t, t + len)
    let tHistMass = way.slice(H.mass, t, t + len)

    // We do not want bias near the edges.
    // A pattern mask for this t. Only these values of the pattern
    // can be taken into account.
    let tPattMass = way.map2(tHistMass, P.mass, (m, n) => m * n)

    // Compute how much the slice resembles the pattern.
    // 0 & 0 => 1
    // 0 & 1 => 0
    // 1 & 1 => 1
    // 0.5 & 0.5 => 1
    const match = way.map2(P.value, tHistValue, (a, b) => 1 - Math.abs(a - b))
    // Mask out those resemblances that are not part of the pattern.
    // We do not care about them.
    const masked = way.map2(match, tPattMass, (d, m) => d * m)

    // Measure how much the slice resembles the pattern
    // by summing up the matches after masking.
    // If the pattern exists in the slice, support is high.
    let tSupport = way.sum(masked)

    // To make things more crispier, we use only perfect matches.
    if (tSupport === massSum) {
      // Probability sum.
      const maskedTHistValue = way.map2(tHistValue, tHistMass, (v, m) => v * m)
      contextSum = way.add(contextSum, maskedTHistValue)
      // Weight sum
      supportSum = way.add(supportSum, tHistMass)
    }
  }

  // Normalise to get the weighted average.
  let contextAverage = way.map2(contextSum, supportSum, (ctx, sup) => {
    // Take care of possible division by zero.
    return sup > 0 ? ctx / sup : 0
  })

  // If sum of support is 0, there is absolutely no matching pattern.
  // Then we just need to use our best knowledge, channel means.
  if (way.sum(supportSum) === 0) {
    // Stretch the prior
    contextAverage = way.map(contextAverage, (zero, c) => prior[c])
  }

  return {
    value: contextAverage,
    mass: supportSum
  }
}
