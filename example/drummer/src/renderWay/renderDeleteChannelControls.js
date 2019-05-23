module.exports = (way, click) => {
  const container = document.createElement('div');

  way.forEach((channel, c) => {
    const ctrl = document.createElement('div');
    ctrl.classList.add('channel-control');

    const b = document.createElement('button');
    b.innerHTML = '&ndash;';
    b.title = 'Delete channel';
    b.addEventListener('click', () => {
      click(c);
    });

    ctrl.appendChild(b);
    container.appendChild(ctrl);
  });
  return container;
};
