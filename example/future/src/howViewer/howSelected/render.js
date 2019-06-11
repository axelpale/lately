const way = require('senseway')
const wayElem = require('../../lib/wayElem')

module.exports = (model, dispatch) => {
  const c = model.how.select.channel
  const t = model.how.select.time

  const waySelected = way.set(way.fill(model.timeline, 0), c, t, 1)
  return wayElem(waySelected, {
    reversed: true,
    heading: 'Selected Event',
    caption: 'This is our selection.'
  })
}
