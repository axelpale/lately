const way = require('senseway')
const howTitle = require('./howTitle/render')
const howChannels = require('./howChannels/render')
const howFrames = require('./howFrames/render')
const howSelected = require('./howSelected/render')
const wayel = require('../lib/wayElem')

module.exports = (model, dispatch) => {
  const root = document.createElement('div')
  root.classList.add('how-container')

  root.appendChild(howTitle(model, dispatch))

  const timeline = document.createElement('div')
  timeline.classList.add('how-timeline')

  timeline.appendChild(wayel(model.timeline, {
    reversed: true,
    heading: 'Timeline',
    caption: 'Here is the timeline - our training data set.'
  }))

  timeline.appendChild(howChannels(model, dispatch))
  timeline.appendChild(howFrames(model, dispatch))

  const timelineMass = way.map(model.timeline, q => q === null ? 0 : 1)
  timeline.appendChild(wayel(timelineMass, {
    reversed: true,
    heading: 'Timeline Mass',
    caption: 'Mass shows which atomic events we know and which we '
      + 'do not know. Here are masses for each. White = 0, Black = 1.'
  }))

  const unknownEvents = way.map(timelineMass, q => 1 - q)
  timeline.appendChild(wayel(unknownEvents, {
    reversed: true,
    heading: 'Unknown Data',
    caption: 'These atomic events we do not know. Our goal is to predict '
      + 'their value from the training data.'
  }))

  const eventSelector = wayel(unknownEvents, {
    reversed: true,
    heading: 'Event to Predict',
    caption: 'We predict the events one by one. Select an event to see '
      + 'how we form its probability.',
    selected: model.how.selected
  })
  eventSelector.addEventListener('click', (ev) => {
    dispatch({
      type: 'HOW_EDIT_SELECTED',
      channel: parseInt(ev.target.dataset.channel),
      time: parseInt(ev.target.dataset.time)
    })
  })
  timeline.appendChild(eventSelector)

  timeline.appendChild(howSelected(model, dispatch))

  root.appendChild(timeline)

  return root
}
