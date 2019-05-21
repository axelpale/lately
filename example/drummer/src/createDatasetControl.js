const datasets = require('./datasets');

module.exports = (model, dispatch) => {
  const control = document.createElement('div');
  control.classList.add('dataset');
  const input = document.createElement('select');

  Object.keys(datasets).forEach(key => {
    const opt = document.createElement('option');
    opt.value = key;
    if (model.historyKey === key) { opt.selected = 'selected'; }
    opt.innerHTML = key;
    input.appendChild(opt);
  });

  control.appendChild(input);

  input.addEventListener('change', (ev) => {
    dispatch({
      type: 'SELECT_DATASET',
      key: ev.target.value
    });
  });

  return control;
};
