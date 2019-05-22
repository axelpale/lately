const renderWay = require('./renderWay');
const mcbsp = require('mcbsp');
const way = require('senseway');

module.exports = (model, dispatch) => {
  const distance = model.predictionDistance;
  const channels = model.history.length;

  let values = way.create(channels, distance, 0);
  values[0][0] = 1;
  let mask = way.create(channels, distance, 0);
  mask[0][0] = 1;

  const avgContext = mcbsp.pattern.averageContext(model.history, values, mask);
  const dependent = mcbsp.pattern.dependent(model.history, values, mask);

  const container = document.createElement('div');
  container.appendChild(renderWay(values, 'pattern'));
  container.appendChild(renderWay(mask, 'mask'));
  container.appendChild(renderWay(avgContext, 'avg context'));
  container.appendChild(renderWay(dependent, 'dependent'));
  return container;
};
