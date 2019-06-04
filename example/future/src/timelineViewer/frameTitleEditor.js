
module.exports = (model, dispatch) => {
  const form = document.createElement('form');

  const t = model.frameOnEdit;
  const title = model.frames[t].title;

  const text = document.createElement('input');
  text.type = 'text';
  text.value = title;
  form.appendChild(text);

  const okBtn = document.createElement('button');
  okBtn.type = 'button';
  okBtn.innerHTML = 'OK';
  form.appendChild(okBtn);

  // Events

  setTimeout(() => {
    text.focus();
  }, 200);

  form.addEventListener('submit', ev => {
    ev.preventDefault();
    dispatch({
      type: 'EDIT_FRAME_TITLE',
      time: t,
      title: text.value
    });
  });

  okBtn.addEventListener('click', ev => {
    dispatch({
      type: 'EDIT_FRAME_TITLE',
      time: t,
      title: text.value
    });
  });

  return form;
}
