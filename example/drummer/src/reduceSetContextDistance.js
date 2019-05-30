const way = require('senseway')

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'SET_CONTEXT_DISTANCE': {
      return Object.assign({}, model, {
        contextDistance: Math.min(ev.value, way.len(model.history))
      });
    }

    default:
      return model;
  }
};
