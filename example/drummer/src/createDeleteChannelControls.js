const createDeleteChannelButton = require('./createDeleteChannelButton');

module.exports = (model, dispatch) => {
  const container = document.createElement('div');
  model.history.forEach((channel, c) => {
    container.appendChild(createDeleteChannelButton(c, dispatch));
  });
  return container;
};
