const way = require('senseway')
const wayElem = require('../../lib/wayElem')

module.exports = (model, dispatch) => {

  const waySelected = (() => {
    const c = model.how.select.channel
    const t = model.how.select.time
    return way.set(way.fill(model.timeline, 0), c, t, 1)
  })()

  const eventSelector = wayElem(model.timeline, {
    reversed: true,
    heading: 'Event to Predict',
    caption: 'We predict the events one by one. '
      + '<strong>Select</strong> an event to see '
      + 'how we form its probability.',
    selected: waySelected
  })

  eventSelector.addEventListener('click', (ev) => {
    dispatch({
      type: 'HOW_EDIT_SELECTED',
      channel: parseInt(ev.target.dataset.channel),
      time: parseInt(ev.target.dataset.time)
    })
  })

  return eventSelector
}
