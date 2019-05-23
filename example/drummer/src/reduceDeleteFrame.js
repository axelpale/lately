const way = require('senseway');

const historyDeleteFrame = (hist, t) => {
  const newHist = way.clone(hist);
  newHist.map((ch) => {
    return ch.splice(t, 1);
  });
  return newHist;
};

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'DELETE_HISTORY_FRAME': {
      return Object.assign({}, model, {
        history: historyDeleteFrame(model.history, ev.time)
      });
    }

    default:
      return model;
  }
};
