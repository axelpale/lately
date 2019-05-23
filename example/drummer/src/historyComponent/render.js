const renderWay = require('../renderWay');

module.exports = (model, dispatch) => {
  return renderWay(model.history, {
    label: 'history',
    class: 'history',
    numbers: true,
    click: (channel, time, value) => {
      dispatch({
        type: 'SET_VALUE',
        channel: channel,
        time: time,
        value: parseFloat(value) > 0.5 ? 0 : 1 // invert
      });
    },
    deleteChannel: (channel) => {
      dispatch({
        type: 'DELETE_HISTORY_CHANNEL',
        channel: channel
      });
    },
    deleteFrame: (time) => {
      dispatch({
        type: 'DELETE_HISTORY_FRAME',
        time: time
      });
    },
    duplicateChannel: (channel) => {
      dispatch({
        type: 'DUPLICATE_HISTORY_CHANNEL',
        channel: channel
      });
    },
    duplicateFrame: (time) => {
      dispatch({
        type: 'DUPLICATE_HISTORY_FRAME',
        time: time
      });
    }
  });
};
