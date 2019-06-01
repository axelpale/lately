const renderWay = require('../renderWay');
const way = require('senseway');

module.exports = (model, dispatch) => {
  // Trim context to history size
  const context = way.last(model.history, model.contextDistance);

  return renderWay(context, {
    label: 'context',
    numbers: true,
    numbersBegin: model.history[0].length - model.contextDistance
  });
};
