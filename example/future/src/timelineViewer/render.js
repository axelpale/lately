const way = require('senseway');

module.exports = (model, dispatch) => {
  const root = document.createElement('div');

  const W = way.width(model.timeline)
  const LEN = way.len(model.timeline)

  for (let t = LEN - 1; t >= 0; t -= 1) {
    const row = document.createElement('div');
    row.classList.add('row');

    const cells = document.createElement('div');
    cells.classList.add('cells');

    for (let c = 0; c < W; c += 1) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

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
      img.classList.add('cell-event');
      img.style.backgroundColor = model.channels[c].backgroundColor;
      cell.appendChild(img);

      cells.appendChild(cell);
    }

    row.appendChild(cells);
    root.appendChild(row);
  }

  return root;
};
