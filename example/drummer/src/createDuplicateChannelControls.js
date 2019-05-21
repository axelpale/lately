const createDuplicateChannelButton = require('./createDuplicateChannelButton');

module.exports = (model, dispatch) => {
  const container = document.createElement('div');
  model.history.forEach((channel, c) => {
    container.appendChild(createDuplicateChannelButton(c, dispatch));
  });
  return container;
};
