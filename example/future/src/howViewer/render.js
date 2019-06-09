const way = require('senseway')
const howTitle = require('./howTitle/render')

const wayel = (wa, opts) => {
  const el = document.createElement('div')
  el.classList.add('how-way-container')
  el.innerHTML = way.html(wa, opts)
  return el
}

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

  const timelineMass = way.map(model.timeline, q => q === null ? 0 : 1)
  timeline.appendChild(wayel(timelineMass, {
    reversed: true,
    heading: 'Timeline Mass',
    caption: 'Mass shows which atomic events we know and which we '
      + 'do not know. Here are masses for each timeslot. White = 0, Black = 1.'
  }))

  const unknownEvents = way.map(timelineMass, q => 1 - q)
  timeline.appendChild(wayel(unknownEvents, {
    reversed: true,
    heading: 'Unknown Data',
    caption: 'These atomic events we do not know. Our goal is to predict '
      + 'their value from the training data.'
  }))

  root.appendChild(timeline)

  return root
}
