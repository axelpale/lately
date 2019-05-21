module.exports = (model, ev) => {
  switch (ev.type) {

    case 'SET_CONTEXT_DISTANCE': {
      return Object.assign({}, model, {
        contextDistance: ev.value
      });
    }

    default:
      return model;
  }
};
