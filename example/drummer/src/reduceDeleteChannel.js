module.exports = (model, ev) => {
  switch (ev.type) {

    case 'DELETE_HISTORY_CHANNEL': {
      return Object.assign({}, model, {
        history: model.history.filter((ch, c) => c !== ev.channel)
      });
    }

    default:
      return model;
  }
};
