const way = require('senseway');
const mcbsp = require('mcbsp');
const renderWay = require('../renderWay');

module.exports = (model, dispatch) => {
  const container = document.createElement('div');
  const channelMeans = way.mean(model.history);
  const channelEntropy = way.map(channelMeans, mcbsp.gain);

  container.appendChild(renderWay(channelMeans, 'history mean'));
  container.appendChild(renderWay(channelEntropy, 'history entropy'));

  return container;
};
