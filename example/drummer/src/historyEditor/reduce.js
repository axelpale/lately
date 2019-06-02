const way = require('senseway');

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'DELETE_HISTORY_CHANNEL': {
      const historyCandidate = way.dropChannel(model.history, ev.channel)

      if (way.width(historyCandidate) < 1) {
        return model
      }

      return Object.assign({}, model, {
        history: historyCandidate,
        patternValues: way.dropChannel(model.patternValues, ev.channel),
        patternMask: way.dropChannel(model.patternValues, ev.channel)
      });
    }

    case 'DELETE_HISTORY_FRAME': {
      const newHist = way.dropAt(model.history, ev.time)
      const newHistLen = way.len(newHist)

      if (newHistLen < 1) {
        return model
      }

      return Object.assign({}, model, {
        history: newHist,
        contextDistance: Math.min(model.contextDistance, newHistLen),
        predictionDistance: Math.min(model.predictionDistance, newHistLen)
      });
    }

    case 'DUPLICATE_HISTORY_CHANNEL': {
      return Object.assign({}, model, {
        history: way.repeatChannel(model.history, ev.channel),
        patternValues: way.repeatChannel(model.patternValues, ev.channel),
        patternMask: way.repeatChannel(model.patternMask, ev.channel)
      });
    }

    case 'DUPLICATE_HISTORY_FRAME': {
      return Object.assign({}, model, {
        history: way.repeatAt(model.history, ev.time)
      });
    }

    case 'SET_HISTORY_VALUE': {
      return Object.assign({}, model, {
        history: way.set(model.history, ev.channel, ev.time, ev.value)
      });
    }

    default:
      return model;
  }
};
