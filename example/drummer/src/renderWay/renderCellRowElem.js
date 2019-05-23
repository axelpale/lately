module.exports = (t) => {
  const r = document.createElement('div');
  r.dataset.time = t;
  r.classList.add('cellrow');
  return r;
};
