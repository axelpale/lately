const way = require('senseway');

const historyDeleteFrame = (hist, t) => {
  const newHist = way.clone(hist);
  newHist.map((ch) => {
    return ch.splice(t, 1);
  });
  return newHist;
};

const historyDuplicateFrame = (hist, t) => {
  const newHist = way.clone(hist);
  newHist.map((ch, i) => {
    const cellValue = ch[t];
    return ch.splice(t, 0, cellValue);
  });
  return newHist;
};

const historySetValue = (hist, ev) => {
  const newHist = way.clone(hist);
  newHist[ev.channel][ev.time] = ev.value;
  return newHist;
};

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'DELETE_HISTORY_CHANNEL': {
      return Object.assign({}, model, {
        history: model.history.filter((ch, c) => c !== ev.channel)
      });
    }

    case 'DELETE_HISTORY_FRAME': {
      return Object.assign({}, model, {
        history: historyDeleteFrame(model.history, ev.time)
      });
    }

    case 'DUPLICATE_HISTORY_CHANNEL': {
      const c = ev.channel;
      const ch = [model.history[c]];
      const pre = model.history.slice(0, c);
      const post = model.history.slice(c);
      return Object.assign({}, model, {
        history: [].concat(pre, ch, post)
      });
    }

    case 'DUPLICATE_HISTORY_FRAME': {
      return Object.assign({}, model, {
        history: historyDuplicateFrame(model.history, ev.time)
      });
    }

    case 'SET_VALUE': {
      return Object.assign({}, model, {
        history: historySetValue(model.history, ev)
      });
    }

    default:
      return model;
  }
};
