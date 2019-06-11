const way = require('senseway')
const wayElem = require('../../lib/wayElem')

module.exports = (model, dispatch) => {
  const tline = wayElem(model.timeline, {
    reversed: true,
    heading: 'Channels',
    caption: 'The data consists of channels...'
  })

  // Allow special margin to reveal channels.
  tline.classList.add('how-channels')

  return tline
}
