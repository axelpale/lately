const predict = require('../lib/predict');

module.exports = (model, dispatch) => {
  const root = document.createElement('div');

  if (model.select === null) {
    return root;
  }

  const c = model.select.channel;
  const t = model.select.time;
  const pred = predict(model, c, t);

  const row = document.createElement('div');
  row.classList.add('row');
  row.classList.add('row-input');

  let html = ''
  html += 'Channel ' + c + ': ' + model.channels[c].title + '<br>'
  html += 'Frame ' + t + ': ' + model.frames[t].title + '<br>'
  html += 'Probability: ' + pred.prob.toFixed(2) + '<br>'
  html += 'Channel Mean: ' + pred.priorProb.toFixed(2) + '<br>'

  row.innerHTML = html;

  root.appendChild(row);

  // Events

  return root;
}
