const datasets = require('./datasets');
const way = require('senseway')

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'SELECT_DATASET': {
      const dset = datasets[ev.key]
      return Object.assign({}, model, {
        historyKey: ev.key,
        history: dset,
        contextDistance: Math.min(model.contextDistance, way.len(dset)),
        predictionDistance: Math.min(model.predictionDistance, way.len(dset))
      });
    }

    default:
      return model;
  }
};
