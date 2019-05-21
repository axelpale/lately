module.exports = (t) => {
  const f = document.createElement('div');
  f.classList.add('frame');

  const label = document.createElement('div');
  label.classList.add('frame-label');

  if (typeof t === 'number') {
    f.dataset.time = t;
    if (t % 4 === 0) {
      label.innerHTML = t.toString(10);
    } else {
      label.innerHTML = '';
    }
  } else {
    label.innerHTML = '' + t;
  }

  f.appendChild(label);

  return f;
};
