const renderSlider = require('../renderSlider');

module.exports = (model, dispatch) => {
  return renderSlider({
    class: 'context-distance',
    name: 'contextDistance',
    value: model.contextDistance,
    label: 'context length',
    change: (sliderValue) => {
      dispatch({
        type: 'SET_CONTEXT_DISTANCE',
        value: parseInt(sliderValue)
      });
    },
  });
};
