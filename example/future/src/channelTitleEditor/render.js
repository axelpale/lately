
module.exports = (model, dispatch) => {
  const root = document.createElement('div');

  if (model.channelOnEdit === null) {
    return root;
  }

  const c = model.channelOnEdit;
  const title = model.channels[c].title;

  const row = document.createElement('div');
  row.classList.add('row');
  row.classList.add('row-input');

  const text = document.createElement('input');
  text.type = 'text';
  text.value = title;

  row.appendChild(text);

  const okBtn = document.createElement('button');
  okBtn.innerHTML = 'OK';
  okBtn.addEventListener('click', ev => {
    dispatch({
      type: 'EDIT_CHANNEL_TITLE',
      channel: c,
      title: text.value
    })
  })
  row.appendChild(okBtn);

  root.appendChild(row);

  return root;
}
