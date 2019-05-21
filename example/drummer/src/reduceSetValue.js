const way = require('senseway');

const historySetValue = (hist, ev) => {
  const newHist = way.clone(hist);
  newHist[ev.channel][ev.time] = ev.value;
  return newHist;
};

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'SET_VALUE': {
      return Object.assign({}, model, {
        history: historySetValue(model.history, ev)
      });
    }

    default:
      return model;
  }
};
