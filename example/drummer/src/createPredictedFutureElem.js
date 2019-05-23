const renderWay = require('./renderWay');
const predict = require('./predict');

module.exports = (model, dispatch) => {
  const prediction = predict(model);
  return renderWay(prediction, {
    label: 'predicted future',
    numbers: true,
    numbersBegin: model.history[0].length
  });
};
