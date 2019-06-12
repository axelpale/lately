module.exports = (model, dispatch) => {
  const root = document.createElement('div')
  root.classList.add('row-title')

  const chan = document.createElement('div')
  chan.innerHTML = 'Abc |'
  root.appendChild(chan)

  const fram = document.createElement('div')
  fram.innerHTML = 'Abc –'
  root.appendChild(fram)

  chan.addEventListener('click', ev => {
    dispatch({
      type: 'CREATE_CHANNEL'
    });
  });

  fram.addEventListener('click', ev => {
    dispatch({
      type: 'CREATE_FRAME'
    });
  });

  return root;
}
