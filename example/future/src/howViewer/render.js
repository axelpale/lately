const way = require('senseway')
const howTitle = require('./howTitle/render')

const wayel = (wa, opts) => {
  const el = document.createElement('div')
  el.innerHTML = way.html(wa, opts)
  return el
}

module.exports = (model, dispatch) => {
  const root = document.createElement('div')

  root.appendChild(howTitle(model, dispatch))

  const timeline = document.createElement('div')
  timeline.classList.add('how-timeline')

  timeline.appendChild(wayel(model.timeline, {
    reversed: true,
    heading: 'Timeline',
    caption: 'This is the timeline - our training data set'
  }))

  root.appendChild(timeline)

  return root
}
