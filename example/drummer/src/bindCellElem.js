module.exports = (cel, dispatch) => {
  cel.addEventListener('click', () => {
    dispatch({
      type: 'SET_VALUE',
      time: cel.dataset.time,
      channel: cel.dataset.channel,
      value: parseFloat(cel.dataset.value) > 0.5 ? 0 : 1 // invert
    });
  });
};
