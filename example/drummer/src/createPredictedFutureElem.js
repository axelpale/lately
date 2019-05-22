const createFrameElem = require('./createFrameElem');
const createCellRowElem = require('./createCellRowElem');
const createCellElem = require('./createCellElem');
const renderWay = require('./renderWay');
const predict = require('./predict');

module.exports = (model, dispatch) => {
  const prediction = predict(model);
  return renderWay(prediction, 'prediction');
};
