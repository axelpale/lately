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

  const c = channel
  const t = time
  const w = way.width(model.timeline)
  const ctxlen = model.contextLength

  const onePat = pat.single(w, ctxlen, c, 1)
  const ctxMean = pat.contextMean(timelinePat, onePat)

  // Now, ctxMean gives probability for 1 at context, given 1 at same
  // relative position.

  const beg = t - Math.max(0, Math.floor((ctxlen - 1) / 2))
  const end = beg + ctxlen
  const ctxCurr = pat.slice(timelinePat, beg, end)

  const probField = way.map(ctxMean.value, (q, qc, qt) => {
    const mv = q // P(B=1|A=1)
    const mm = ctxMean.mass[qc][qt]
    const cv = ctxCurr.value[qc][qt] // B
    const cm = ctxCurr.mass[qc][qt]
    const pr = prior[qc] // P(B=1)

    if (mm * cm < 0.0001) {
      // No mass, no effect
      return 1
    }

    if (qc === c && qt === t) {
      // No autoeffect P(A|A) = P(A)
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
  }) // P(A)

  const prob = way.reduce(probField, (acc, p) => {
    return acc * p
  }, prior[c])

  // Prediction
  return {
    channel: channel,
    context: ctxCurr,
    contextMean: ctxMean,
    probField: probField,
    prob: prob,
    time: time
  }
}
