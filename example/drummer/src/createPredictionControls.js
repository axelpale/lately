const createPredictionDistanceControl = require('./createPredictionDistanceControl');
const createContextDistanceControl = require('./createContextDistanceControl');

module.exports = (model, dispatch) => {
  const controls = document.createElement('div');

  const contextDistanceElem = createContextDistanceControl(model, dispatch);
  controls.appendChild(contextDistanceElem);

  const predDistanceElem = createPredictionDistanceControl(model, dispatch);
  controls.appendChild(predDistanceElem);

  return controls;
};
