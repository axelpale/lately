const way = require('senseway');
const frameTitle = require('./frameTitle');
const clearElem = require('../lib/clearElem');
const predict = require('../lib/predict');

module.exports = (model, dispatch) => {
  const root = document.createElement('div');

  const W = way.width(model.timeline)
  const LEN = way.len(model.timeline)

  // Timeline events
  for (let t = LEN - 1; t >= 0; t -= 1) {
    const row = document.createElement('div');
    row.classList.add('row');
    root.appendChild(row);

    row.appendChild(frameTitle(model, dispatch, t))

    const cells = document.createElement('div');
    cells.classList.add('cells');
    row.appendChild(cells);

    for (let c = 0; c < W; c += 1) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.classList.add('cell-event');

      const spine = document.createElement('div');
      spine.classList.add('cell-spine');
      cell.appendChild(spine);

      const icon = document.createElement('div');
      icon.classList.add('cell-icon');
      icon.style.backgroundColor = model.channels[c].backgroundColor;
      cell.appendChild(icon);

      const text = document.createElement('div');
      text.classList.add('cell-text');
      cell.appendChild(text);

      const val = model.timeline[c][t];

      if (val === null) {
        cell.classList.add('cell-unknown');
      } else {
        if (val < 0.5) {
          cell.classList.add('cell-empty');
        } else {
          cell.classList.add('cell-full');
        }
      }

      if (val === null) {
        const value = model.timeline;
        const mass = way.map(model.timeline, q => q === null ? 0 : 1);
        const prob = predict(value, mass, c, t);
        if (prob < 0.5) {
          icon.style.visibility = 'hidden';
        }
        text.innerHTML = '<span>' + Math.floor(100 * prob) + '%</span>';
      }

      cells.appendChild(cell);
    }
  }

  return root;
};
