const way = require('senseway');

const historyRemoveFrame = (hist, t) => {
  const newHist = way.clone(hist);
  newHist.map((ch) => {
    return ch.splice(t, 1);
  });
  return newHist;
};

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'REMOVE_FRAME': {
      return Object.assign({}, model, {
        history: historyRemoveFrame(model.history, ev.time)
      });
    }

    default:
      return model;
  }
};
