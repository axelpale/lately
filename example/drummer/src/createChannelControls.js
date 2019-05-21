const createDuplicateChannelControls = require('./createDuplicateChannelControls');
const createDeleteChannelControls = require('./createDeleteChannelControls');
const createAudioControls = require('./createAudioControls');

module.exports = (model, dispatch) => {
  const container = document.createElement('div');

  container.appendChild(createAudioControls(model, dispatch));
  container.appendChild(createDuplicateChannelControls(model, dispatch));
  container.appendChild(createDeleteChannelControls(model, dispatch));

  return container;
};
