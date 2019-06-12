const way = require('senseway')
const pat = require('sensepat')
const wayElem = require('../../lib/wayElem')

module.exports = (model, dispatch) => {
  const timelinePattern = {
    value: way.map(model.timeline, q => q === null ? 0 : q),
    mass: way.map(model.timeline, q => q === null ? 0 : 1)
  }

  const avg = pat.mean(timelinePattern)
  const priorPred = way.map(model.timeline, (q, c) => q === null ? avg[c] : q)

  return wayElem(priorPred, {
    reversed: true,
    heading: 'Prior Prediction',
    caption: 'Prior probabilities can directly give us the first prediction. '
      + 'This would in fact be our best prediction if all atomic events '
      + 'were independent of each other.'
  })
}
