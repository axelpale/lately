const createCellElem = require('./createCellElem');
const bindCellElem = require('./bindCellElem');
const createFrameElem = require('./createFrameElem');
const createCellRowElem = require('./createCellRowElem');
const createDeleteFrameButton = require('./createDeleteFrameButton');
const createDuplicateFrameButton = require('./createDuplicateFrameButton');

module.exports = (model, dispatch) => {
  const timeline = document.createElement('div');
  const channels = model.history.length;
  const duration = model.history[0].length;

  let t, ch, cel, val, fr, cr;
  for (t = 0; t < duration; t += 1) {
    fr = createFrameElem(t);
    cr = createCellRowElem(t);

    if (t >= duration - model.contextDistance) {
      fr.classList.add('frame-context');
    }

    for (ch = 0; ch < channels; ch += 1) {
      val = model.history[ch][t];
      cel = createCellElem(t, ch, val, channels);
      cel.classList.add('cell-history');
      bindCellElem(cel, dispatch)
      cr.appendChild(cel);
    }
    fr.appendChild(cr);

    fr.appendChild(createDeleteFrameButton(t, dispatch));
    fr.appendChild(createDuplicateFrameButton(t, dispatch));

    timeline.appendChild(fr);
  }

  return timeline;
};
