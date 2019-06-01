const mcbsp = require('mcbsp');
const way = require('senseway');

module.exports = (model) => {
  let contextDistance = model.contextDistance;
  let distance = model.predictionDistance;
  let t = model.history[0].length;
  let context = way.before(model.history, t, contextDistance);
  let pred = mcbsp.naive.predict(model.history, context, distance);
  return pred.probabilities;
};
