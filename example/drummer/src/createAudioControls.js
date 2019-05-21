module.exports = (model, dispatch) => {
  const controls = document.createElement('div');

  model.history.forEach((channel, c) => {
    const audio = document.createElement('div');
    audio.classList.add('channel-control');
    audio.dataset.channel = c;

    const img = document.createElement('img');
    img.width = 16;
    img.height = 16;
    img.src = 'img/audio.png';
    audio.appendChild(img);

    controls.appendChild(audio);
  });

  return controls;
};
