const datasets = require('./datasets');

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'SELECT_DATASET': {
      return Object.assign({}, model, {
        historyKey: ev.key,
        history: datasets[ev.key]
      });
    }

    default:
      return model;
  }
};
