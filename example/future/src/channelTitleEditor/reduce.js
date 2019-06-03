const way = require('senseway');

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'EDIT_CHANNEL_TITLE': {
      return Object.assign({}, model, {
        channelOnEdit: null,
        channels: model.channels.map((chConf, c) => {
          if (c === ev.channel) {
            return Object.assign({}, chConf, {
              title: ev.title
            });
          }
          return chConf;
        })
      });
    }

    default:
      return model;
  }
};
