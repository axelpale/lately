module.exports = (model, ev) => {
  switch (ev.type) {

    case 'SET_PREDICTION_DISTANCE': {
      return Object.assign({}, model, {
        predictionDistance: ev.value
      });
    }

    default:
      return model;
  }
};
