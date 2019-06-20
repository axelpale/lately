const way = require('senseway')
const pat = require('sensepat')

module.exports = (model, channel, time) => {
  // Find probability for 1 in the given cell position,
  // given the history.
  //
  // Params
  //   ...
  //   time, time in history
  //
  // Returns
  //   probability for 1
  const timelinePat = pat.mixedToPattern(model.timeline)
  const prior = pat.mean(timelinePat)
  const w = way.width(model.timeline)
  const LEN = way.len(model.timeline)
  const ctxlen = model.contextLength

  const c = channel
  const t = time

  const zeroPat = pat.single(w, ctxlen, c, 0)
  const onePat = pat.single(w, ctxlen, c, 1)

  const zeroMean = pat.contextMean(timelinePat, zeroPat)
  const oneMean = pat.contextMean(timelinePat, onePat)

  const priorMean = {
    value: way.map(zeroMean.value, (q, c) => prior[c]),
    mass: way.map(zeroMean.value, q => 1)
  }

  const zeroGain = pat.infoGain(priorMean, zeroMean)
  const oneGain = pat.infoGain(priorMean, oneMean)

  // Now, oneMean gives probability for 1 at context, given 1 at same
  // relative position.

  const beg = t - Math.max(0, Math.floor((ctxlen - 1) / 2))
  const end = beg + ctxlen
  const ctxCurr = pat.slice(timelinePat, beg, end)

  const cellProb = (mv, mm, cv, cm, pr, qc, qt) => {
    // mv, mean value
    // mm, mean mass i.e. sample size
    // cv, current value
    // cm, current mass, q in range [0, 1]
    // pr, prior probability for the cell being 1
    // qc, channel of the cell
    // qt, time of the cell
    //
    if (mm * cm < 0.0001) {
      // No mass, no effect
      return 1
    }

    if (qc === c && qt === t) {
      // No autoeffect. P(A|A) = P(A)
      return 1
    }

    let pri
    let prob
    if (cv < 0.5) {
      // B=0
      // P(B=0) = 1 - P(B=1)
      if (1 - pr < 0.0001) {
        // Should not happen. 100% prior but still B=0
        console.error('should not happen')
        return 0
      }
      prob = (1 - mv) / (1 - pr)
    } else {
      // B=1
      if (pr < 0.0001) {
        // Should not happen. 0% prior but still B=1
        console.error('should not happen')
        return 0
      }
      prob = mv / pr
    }

    // Take sample size into consideration.
    // Error of the sample mean is propotional to pop_mean / sqrt(sample_size)
    // Let us use sqrt(sample_size) as a weight.
    // Because we need to return only a likelihood factor
    // and not the true probability, the weight can be in arbitrary scale.
    const power = Math.sqrt(mm) / Math.sqrt(LEN)

    // Tryout #1
    // Works badly when extreme mv (0 or 1) because forces likelihood to zero.
    // const weightedProb = Math.pow(prob, power)

    // Tryout #2
    const priorPower = 1 - power
    const weightedProb = power * prob + priorPower * (cv < 0.5 ? 1 - pr : pr)

    return Math.pow(weightedProb, power)
  }

  const zeroField = way.map(zeroMean.value, (q, qc, qt) => {
    const mv = q // P(B=1|A=0)
    const mm = zeroMean.mass[qc][qt]
    const cv = ctxCurr.value[qc][qt] // B
    const cm = ctxCurr.mass[qc][qt]
    const pri = prior[qc] // P(B=1)

    const prob = cellProb(mv, mm, cv, cm, pri, qc, qt)
    return prob
  })
  const oneField = way.map(oneMean.value, (q, qc, qt) => {
    const mv = q // P(B=1|A=1)
    const mm = oneMean.mass[qc][qt]
    const cv = ctxCurr.value[qc][qt] // B
    const cm = ctxCurr.mass[qc][qt]
    const pri = prior[qc] // P(B=1)

    const prob = cellProb(mv, mm, cv, cm, pri, qc, qt)
    return prob
  })

  const zeroLikelihood = way.reduce(zeroField, (acc, p) => {
    return acc * p
  }, 1 - prior[c]) // P(A | B)
  const oneLikelihood = way.reduce(oneField, (acc, p) => {
    return acc * p
  }, prior[c]) // P(A | B)

  // If zeroProb and oneProb are about same, the prior should be returned.
  // Also if no information, use prior.
  let prob
  if (zeroLikelihood + oneLikelihood > 0) {
    prob = oneLikelihood / (zeroLikelihood + oneLikelihood)
  } else {
    prob = prior[c]
  }

  // Prediction
  return {
    channel: channel,
    context: ctxCurr,
    contextMean: oneMean,
    contextPrior: priorMean,
    contextGain: oneGain,
    probField: oneField,
    prob: prob,
    time: time
  }
}
