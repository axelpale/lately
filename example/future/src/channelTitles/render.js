const clearElem = require('../lib/clearElem');

module.exports = (model, dispatch) => {
  const root = document.createElement('div');

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
      dispatch({
        type: 'OPEN_CHANNEL_TITLE_EDITOR',
        channel: c
      });
    });

    cells.appendChild(cell);
  });

  row.appendChild(cells);
  root.appendChild(row);

  return root;
}
