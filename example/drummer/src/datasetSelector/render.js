const datasets = require('../datasets');
const way = require('senseway');

module.exports = (model, dispatch) => {
  const control = document.createElement('div');
  control.classList.add('dataset');

  const label = document.createElement('label');
  label.classList.add('frame-label');
  label.for = 'dataset';
  label.innerHTML = 'dataset';
  control.appendChild(label);

  const input = document.createElement('select');
  input.name = 'dataset';

  Object.keys(datasets).forEach(key => {
    const opt = document.createElement('option');
    opt.value = key;
    if (model.historyKey === key) { opt.selected = 'selected'; }

    const datasetWidth = way.width(datasets[key]);
    const datasetLen = way.len(datasets[key]);
    opt.innerHTML = key + ' - ' + datasetWidth + 'x' + datasetLen;

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
