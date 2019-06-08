const way = require('senseway')
const howTitle = require('./howTitle/render')

module.exports = (model, dispatch) => {
  const root = document.createElement('div')

  root.appendChild(howTitle(model, dispatch))

  return root
}
