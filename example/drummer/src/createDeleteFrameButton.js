module.exports = (t, dispatch) => {
  const b = document.createElement('button');
  b.innerHTML = '&ndash;';

  b.addEventListener('click', () => {
    dispatch({
      type: 'REMOVE_FRAME',
      time: t
    });
  });

  return b;
};
