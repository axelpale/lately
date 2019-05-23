module.exports = (c, dispatch) => {
  const cont = document.createElement('div');
  cont.classList.add('channel-control');

  const b = document.createElement('button');
  b.innerHTML = '&ndash;';
  b.title = 'Delete channel';

  b.addEventListener('click', () => {
    dispatch({
      type: 'DELETE_HISTORY_CHANNEL',
      channel: c
    });
  });

  cont.appendChild(b);
  return cont;
};
