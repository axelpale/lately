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
  const ctxlen = model.contextLength

  const c = channel
  const t = time

  const zeroPat = pat.single(w, ctxlen, c, 0)
  const onePat = pat.single(w, ctxlen, c, 1)

  const zeroMean = pat.contextMean(timelinePat, zeroPat)
  const oneMean = pat.contextMean(timelinePat, onePat)

  zeroMean.mass = way.map(zeroMean.mass, q => q > 1 ? 1 : q)
  oneMean.mass = way.map(oneMean.mass, q => q > 1 ? 1 : q)

  const zeroPrior = {
    value: way.map(zeroMean.value, (q, c) => prior[c]),
    mass: zeroMean.mass
  }
  const onePrior = {
    value: way.map(oneMean.value, (q, c) => prior[c]),
    mass: oneMean.mass
  }

  const zeroGain = pat.infoGain(zeroPrior, zeroMean)
  const oneGain = pat.infoGain(onePrior, oneMean)

  // Now, oneMean gives probability for 1 at context, given 1 at same
  // relative position.

  const beg = t - Math.max(0, Math.floor((ctxlen - 1) / 2))
  const end = beg + ctxlen
  const ctxCurr = pat.slice(timelinePat, beg, end)

  const cellProb = (mv, mm, cv, cm, pr, qc, qt) => {
    // mv, mean value
    // mm, mean mass
    // cv, current value
    // cm, current mass
    // pr, prior probability for 1
    // qc, channel of mean value
    // qt, time of mean value
    //
    if (mm * cm < 0.0001) {
      // No mass, no effect
      return 1
    }

    if (qc === c && qt === t) {
      // No autoeffect. P(A|A) = P(A)
      return 1
    }

    // Assume masses to one TODO Right?

    if (cv < 0.5) {
      // B=0
      // P(B=0) = 1 - P(B=1)
      if (1 - pr < 0.0001) {
        // Should not happen. 100% prior but still B=0
        console.error('should not happen')
        return 0
      }
      return (1 - mv) / (1 - pr)
    } // else

    // B=1
    if (pr < 0.0001) {
      // Should not happen. 0% prior but still B=1
      console.error('should not happen')
      return 0
    }
    return mv / pr
  }

  const zeroField = way.map(zeroMean.value, (q, qc, qt) => {
    const mv = q // P(B=1|A=0)
    const mm = zeroMean.mass[qc][qt]
    const cv = ctxCurr.value[qc][qt] // B
    const cm = ctxCurr.mass[qc][qt]
    const pr = prior[qc] // P(B=1)

    return cellProb(mv, mm, cv, cm, pr, qc, qt)
  })
  const oneField = way.map(oneMean.value, (q, qc, qt) => {
    const mv = q // P(B=1|A=1)
    const mm = oneMean.mass[qc][qt]
    const cv = ctxCurr.value[qc][qt] // B
    const cm = ctxCurr.mass[qc][qt]
    const pr = prior[qc] // P(B=1)

    return cellProb(mv, mm, cv, cm, pr, qc, qt)
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
    contextPrior: onePrior,
    contextGain: oneGain,
    probField: oneField,
    prob: prob,
    time: time
  }
}
