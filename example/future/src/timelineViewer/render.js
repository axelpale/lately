const way = require('senseway');
const clearElem = require('../lib/clearElem');

module.exports = (model, dispatch) => {
  const root = document.createElement('div');

  const W = way.width(model.timeline)
  const LEN = way.len(model.timeline)

  // Channel titles
  {
    const rowInput = document.createElement('div');
    rowInput.classList.add('row');
    rowInput.classList.add('row-input');
    root.appendChild(rowInput);

    const row = document.createElement('div');
    row.classList.add('row');

    const cells = document.createElement('div');
    cells.classList.add('cells');

    model.timeline.forEach((ch, c) => {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.classList.add('cell-title');
      const val = model.channels[c].title;
      cell.innerHTML = '<div class="cell-label">' + val + '</div>';

      cell.addEventListener('click', ev => {
        clearElem(rowInput);
        const t = model.channels[c].title;
        rowInput.innerHTML = '<input type="text" value="' + t + '">';
      });

      cells.appendChild(cell);
    });

    row.appendChild(cells);
    root.appendChild(row);
  }

  // Timeline events
  for (let t = LEN - 1; t >= 0; t -= 1) {
    const row = document.createElement('div');
    row.classList.add('row');

    const cells = document.createElement('div');
    cells.classList.add('cells');

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

    row.appendChild(cells);
    root.appendChild(row);
  }

  return root;
};
