const way = require('senseway')
const howTitle = require('./howTitle/render')

module.exports = (model, dispatch) => {
  const root = document.createElement('div')

  root.appendChild(howTitle(model, dispatch))

  const timeline = document.createElement('div')
  timeline.classList.add('how-timeline')

  const wayel = document.createElement('div')
  wayel.innerHTML = way.html(model.timeline, {
    reversed: true,
    heading: 'Timeline',
    caption: 'This is the timeline - our training data set'
  })
  timeline.appendChild(wayel)

  root.appendChild(timeline)

  return root
}
