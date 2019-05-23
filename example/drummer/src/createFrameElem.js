module.exports = (label) => {
  const f = document.createElement('div');
  f.classList.add('frame');

  const l = document.createElement('div');
  l.classList.add('frame-label');
  l.innerHTML = '' + label;
  f.appendChild(l);
  f.dataset.label = label;

  return f;
};
