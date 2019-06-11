const way = require('senseway')
const pat = require('sensepat')
const wayElem = require('../../lib/wayElem')

module.exports = (model, dispatch) => {
  const timelinePattern = {
    value: way.map(model.timeline, q => q === null ? 0 : q),
    mass: way.map(model.timeline, q => q === null ? 0 : 1)
  }

  const avg = pat.mean(timelinePattern)

  const canvas = way.first(model.timeline, 5)
  const priorHood = way.map(canvas, (q, c) => avg[c])

  return wayElem(priorHood, {
    reversed: true,
    heading: 'Prior Probabilities',
    caption: 'We already know what to expect in the neighborhood in general '
      + 'from the average of each channel.'
  })
}
