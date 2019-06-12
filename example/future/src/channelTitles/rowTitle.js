module.exports = (model, dispatch) => {
  const root = document.createElement('div');
  root.classList.add('row-title');

  root.innerHTML = 'Abc |';

  root.addEventListener('click', ev => {
    dispatch({
      type: 'CREATE_CHANNEL'
    });
  });

  return root;
}
