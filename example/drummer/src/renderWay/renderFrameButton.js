module.exports = (label, click) => {
  const btn = document.createElement('button');
  btn.classList.add('frame-button');
  btn.innerHTML = label;
  btn.addEventListener('click', () => {
    click();
  });
  return btn;
};
