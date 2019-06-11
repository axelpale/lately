const way = require('senseway')
const wayElem = require('../../lib/wayElem')

module.exports = (model, dispatch) => {
  const c = model.how.select.channel
  const canvas = way.first(model.timeline, 5)
  const ones = way.fill(canvas, 1)
  const ctxWindow = way.set(ones, c, 2, 0)

  return wayElem(ctxWindow, {
    reversed: true,
    heading: 'Context Window',
    caption: 'We inspect certain area around each event.'
  })
}
