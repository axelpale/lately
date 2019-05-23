
module.exports = (model, ev) => {
  switch (ev.type) {

    case 'DUPLICATE_HISTORY_CHANNEL': {
      const c = ev.channel;
      const ch = [model.history[c]];
      const pre = model.history.slice(0, c);
      const post = model.history.slice(c);
      return Object.assign({}, model, {
        history: [].concat(pre, ch, post)
      });
    }

    default:
      return model;
  }
};
