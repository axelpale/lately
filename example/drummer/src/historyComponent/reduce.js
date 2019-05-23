const way = require('senseway');

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'DELETE_HISTORY_CHANNEL': {
      return Object.assign({}, model, {
        history: way.dropChannel(model.history, ev.channel),
      });
    }

    case 'DELETE_HISTORY_FRAME': {
      return Object.assign({}, model, {
        history: way.dropAt(model.history, ev.time)
      });
    }

    case 'DUPLICATE_HISTORY_CHANNEL': {
      return Object.assign({}, model, {
        history: way.repeatChannel(model.history, ev.channel),
      });
    }

    case 'DUPLICATE_HISTORY_FRAME': {
      return Object.assign({}, model, {
        history: way.repeatAt(model.history, ev.time)
      });
    }

    case 'SET_HISTORY_VALUE': {
      return Object.assign({}, model, {
        history: way.set(model.history, ev.channel, ev.time, ev.value)
      });
    }

    default:
      return model;
  }
};
