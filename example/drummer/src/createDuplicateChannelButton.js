module.exports = (c, dispatch) => {
  const cont = document.createElement('div');
  cont.classList.add('channel-control');

  const b = document.createElement('button');
  b.innerHTML = '+';
  b.title = 'Duplicate channel';

  b.addEventListener('click', () => {
    dispatch({
      type: 'DUPLICATE_HISTORY_CHANNEL',
      channel: c
    });
  });

  cont.appendChild(b);
  return cont;
};
