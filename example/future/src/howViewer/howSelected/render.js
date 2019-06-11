const way = require('senseway')
const wayElem = require('../../lib/wayElem')

module.exports = (model, dispatch) => {
  return wayElem(model.how.selected, {
    reversed: true,
    heading: 'Selected Event',
    caption: 'This is our selection.'
  })
}
