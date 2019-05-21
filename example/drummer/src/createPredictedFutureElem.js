const createFrameElem = require('./createFrameElem');
const createCellRowElem = require('./createCellRowElem');
const createCellElem = require('./createCellElem');
const predict = require('./predict');

module.exports = (model, dispatch) => {
  const timeline = document.createElement('div');
  const distance = model.predictionDistance;
  const channels = model.history.length;
  const currentTime = model.history[0].length;

  const prediction = predict(model);

  let t, ch, cel, val, fr, cr;
  for (t = 0; t < distance; t += 1) {
    fr = createFrameElem(currentTime + t);
    cr = createCellRowElem(currentTime + t);

    fr.classList.add('prediction');

    for (ch = 0; ch < channels; ch += 1) {
      val = prediction[ch][t];
      cel = createCellElem(t, ch, val, channels);
      cel.classList.add('cell-prediction');
      cr.appendChild(cel);
    }
    fr.appendChild(cr);

    timeline.appendChild(fr);
  }

  return timeline;
};
