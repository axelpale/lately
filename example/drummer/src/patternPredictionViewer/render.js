const renderWay = require('../renderWay');
const mcbsp = require('mcbsp');
const way = require('senseway');

module.exports = (model, dispatch) => {
  // Short aliases
  const hist = model.history;
  const predDist = model.predictionDistance;

  const context = way.last(hist, model.contextDistance);
  const predicted = mcbsp.pattern.predict(hist, context, predDist);
  const future = way.last(predicted, predDist);

  const container = document.createElement('div');

  container.appendChild(renderWay(future, {
    label: 'pattern-driven prediction'
  }));

  return container;
};
