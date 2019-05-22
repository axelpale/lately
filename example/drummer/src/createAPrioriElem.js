const way = require('senseway');
const mcbsp = require('mcbsp');
const renderWay = require('./renderWay');

module.exports = (model, dispatch) => {
  const container = document.createElement('div');
  const channelMeans = way.mean(model.history);
  const channelGain = way.map(channelMeans, mcbsp.gain);

  container.appendChild(renderWay(channelMeans, 'a priori'));
  container.appendChild(renderWay(channelGain, 'infogain'));

  return container;
};
