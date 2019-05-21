const way = require('senseway');
const mcbsp = require('mcbsp');
const createFrameElem = require('./createFrameElem');
const createCellRowElem = require('./createCellRowElem');
const createCellElem = require('./createCellElem');

module.exports = (model, dispatch) => {
  const container = document.createElement('div');
  const numChannels = model.history.length;
  const channelMeans = way.mean(model.history);
  const channelGain = way.map(channelMeans, mcbsp.gain);
  const t = 0;

  // A priori

  let fr = createFrameElem('a priori');
  let cr = createCellRowElem(t);

  fr.classList.add('apriori');

  let c, cel, val;
  for (c = 0; c < numChannels; c += 1) {
    val = channelMeans[c][t];
    cel = createCellElem(t, c, val, numChannels);
    cel.classList.add('cell-apriori');
    cr.appendChild(cel);
  }

  fr.appendChild(cr);
  container.appendChild(fr);

  // Infogain

  fr = createFrameElem('infogain');
  cr = createCellRowElem(t);

  for (c = 0; c < numChannels; c += 1) {
    val = channelGain[c][t];
    cel = createCellElem(t, c, val, numChannels);
    cel.classList.add('cell-infogain');
    cr.appendChild(cel);
  }

  fr.appendChild(cr);
  container.appendChild(fr);

  return container;
};
