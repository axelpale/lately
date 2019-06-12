const way = require('senseway');

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'OPEN_CHANNEL_TITLE_EDITOR': {
      return Object.assign({}, model, {
        channelOnEdit: ev.channel
      })
    }

    case 'CREATE_CHANNEL': {
      const sizeReference = way.channel(model.timeline, 0)
      const newChannel = way.fill(sizeReference, null)
      return Object.assign({}, model, {
        timeline: way.mix(newChannel, model.timeline),
        channels: [].concat([{
          title: '?',
          backgroundColor: '#8A1C82'
        }], model.channels),
        channelOnEdit: 0 // Open name edit input
      })
    }

    default:
      return model
  }
};
