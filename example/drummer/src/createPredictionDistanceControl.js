const renderSlider = require('./renderSlider');

module.exports = (model, dispatch) => {
  return renderSlider({
    class: 'prediction-distance',
    name: 'predictionDistance',
    value: model.predictionDistance,
    label: 'prediction length',
    change: (sliderValue) => {
      dispatch({
        type: 'SET_PREDICTION_DISTANCE',
        value: sliderValue
      });
    }
  });
};
