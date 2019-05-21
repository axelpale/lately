module.exports = (t, dispatch) => {
  const b = document.createElement('button');
  b.innerHTML = '+';

  b.addEventListener('click', () => {
    dispatch({
      type: 'DUPLICATE_FRAME',
      time: t
    });
  });

  return b;
};
