const way = require('senseway')
const wayElem = require('../../lib/wayElem')

module.exports = (model, dispatch) => {
  const first = way.find(model.how.selected, q => q === 1)
  const c = first.channel

  const canvas = way.first(model.timeline, 5)
  const ones = way.fill(canvas, 1)
  const ctxWindow = way.set(ones, c, 2, 0)

  return wayElem(ctxWindow, {
    reversed: true,
    heading: 'Context Window',
    caption: 'Context represents the neighborhood of the event. '
      + 'We are interested what happened in this neighborhood during '
      + 'the past events.'
  })
}
