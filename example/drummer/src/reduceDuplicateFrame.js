const way = require('senseway');

const historyDuplicateFrame = (hist, t) => {
  const newHist = way.clone(hist);
  newHist.map((ch, i) => {
    const cellValue = ch[t];
    return ch.splice(t, 0, cellValue);
  });
  return newHist;
};

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'DUPLICATE_FRAME': {
      return Object.assign({}, model, {
        history: historyDuplicateFrame(model.history, ev.time)
      });
    }

    default:
      return model;
  }
};
