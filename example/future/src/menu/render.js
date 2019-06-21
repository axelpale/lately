const download = require('./download')

module.exports = (model, dispatch) => {
  const root = document.createElement('div');

  const row = document.createElement('div');
  row.classList.add('row');
  row.classList.add('row-input');

  const exportBtn = document.createElement('input');
  exportBtn.type = 'button';
  exportBtn.value = 'Export file';
  row.appendChild(exportBtn);

  const importBtn = document.createElement('input');
  importBtn.type = 'file';
  row.appendChild(importBtn);

  root.appendChild(row);

  // Events

  exportBtn.addEventListener('click', ev => {
    const ex = {
      version: model.version,
      channels: model.channels,
      frames: model.frames,
      timeline: model.timeline
    }
    download('timeline.json', JSON.stringify(ex, null, 2))
  });

  importBtn.addEventListener('change', ev => {
    // TODO
    const selectedFile = importBtn.files[0];
    var reader = new FileReader();
    reader.onload = (evt) => {
      const parsedModel = JSON.parse(evt.target.result);
      dispatch({
        type: 'IMPORT_MODEL',
        model: parsedModel
      })
    }
    reader.readAsText(selectedFile, 'UTF-8');
  }, false);

  return root;
}
