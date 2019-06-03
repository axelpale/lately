
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

  const form = document.createElement('form');

  const text = document.createElement('input');
  text.type = 'text';
  text.value = title;
  form.appendChild(text);

  const okBtn = document.createElement('button');
  okBtn.type = 'button';
  okBtn.innerHTML = 'OK';
  form.appendChild(okBtn);

  row.appendChild(form);
  root.appendChild(row);

  // Events

  setTimeout(() => {
    text.focus();
  }, 200);

  form.addEventListener('submit', ev => {
    ev.preventDefault();
    dispatch({
      type: 'EDIT_CHANNEL_TITLE',
      channel: c,
      title: text.value
    });
  });

  okBtn.addEventListener('click', ev => {
    dispatch({
      type: 'EDIT_CHANNEL_TITLE',
      channel: c,
      title: text.value
    });
  });

  return root;
}