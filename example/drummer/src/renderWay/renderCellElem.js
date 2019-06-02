module.exports = (ch, t, value, label) => {
  const cel = document.createElement('div');
  cel.dataset.channel = ch;
  cel.dataset.time = t;
  cel.dataset.value = value;
  cel.classList.add('cell');

  const probStr = ((1 - value) * 100).toFixed(0) + '%';
  cel.style.backgroundColor = 'hsl(0,0%,' + probStr + ')';

  cel.title = label;

  return cel;
};
