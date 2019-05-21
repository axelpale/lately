module.exports = (model, dispatch) => {
  const control = document.createElement('div');

  const input = document.createElement('input');
  input.type = 'range';
  input.value = model.predictionDistance;
  input.name = 'predictionDistance';
  input.min = '1';
  input.max = '16';
  input.step = '1';

  input.addEventListener('change', (ev) => {
    dispatch({
      type: 'SET_PREDICTION_DISTANCE',
      value: parseInt(input.value)
    });
  });

  const label = document.createElement('label');
  label.for = 'predictionDistance';
  label.innerHTML = ' ' + model.predictionDistance + ' Prediction Distance';

  control.appendChild(input);
  control.appendChild(label);

  return control;
};
