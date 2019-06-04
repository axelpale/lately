const way = require('senseway');
const frameTitle = require('./frameTitle');
const clearElem = require('../lib/clearElem');

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

      const img = document.createElement('div');
      img.classList.add('cell-label');
      img.style.backgroundColor = model.channels[c].backgroundColor;
      cell.appendChild(img);

      cells.appendChild(cell);
    }
  }

  return root;
};
