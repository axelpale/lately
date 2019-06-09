const way = require('senseway')
const pat = require('sensepat')

module.exports = (historyValues, historyMask, channel, time) => {
  // Find probability for 1 in the given cell position,
  // given the history.
  //
  // Params
  //   ...
  //   time, time in history
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

  // TODO make into a parameter
  const CTXLEN = 5
  const CTXC = channel
  const CTXT = Math.floor((CTXLEN - 1) / 2) // 1 => 0, 5 => 2, 8 => 3

  // Make into a sensepat
  const hist = pat.pattern(historyValues, historyMask)
  const W = pat.width(hist)
  const L = pat.len(hist)

  // 0th order prediction: channel expectance
  const prior = pat.mean(hist)
  // return prior[channel]

  // 1st order prediction: what does each of the neighboring cells predict?
  // I.e. how much information each neighboring cell gives when compared
  // to the channel mean.
  // Find patterns

  const zero = way.create(W, CTXLEN, 0)
  const one = way.set(zero, CTXC, CTXT, 1)

  const pattZero = {
    value: zero,
    mass: one
  }
  const pattOne = {
    value: one,
    mass: one
  }

  const pattPrior = {
    value: way.map(zero, (q, c) => prior[c]),
    mass: way.fill(zero, 1)
  }

  const ctx0 = pat.contextMean(hist, pattZero)
  const ctx1 = pat.contextMean(hist, pattOne)

  // Normalize masses
  ctx0.mass = way.normalize(ctx0.mass)
  ctx1.mass = way.normalize(ctx1.mass)

  // Gains tell us which positions and values are meaningful
  // If summed, they give mutual information?
  const gain0 = pat.infoGain(pattPrior, ctx0)
  const gain1 = pat.infoGain(pattPrior, ctx1)

  // Now we need to decide which one matches the context the best.
  const context = way.slice(hist.value, time - CTXT, time - CTXT + CTXLEN)
  const contextMass = way.slice(hist.mass, time - CTXT, time - CTXT + CTXLEN)

  // Without delicate theoretical background let us treat gains
  // as weights for now.
  const g0 = pat.sum(gain0)
  const g1 = pat.sum(gain1)

  let prob // prob for 1
  if (g0 + g1 === 0) {
    prob = 0
  } else {
    prob = g1 / (g0 + g1)
  }

  // Prediction
  return {
    channel: channel,
    context: context,
    prob: prob,
    time: time
  }
}
