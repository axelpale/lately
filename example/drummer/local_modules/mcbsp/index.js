// Multi-channel binary predictor
//
const lib = require('./lib');
const way = require('senseway');

exports.past = (hist, t, size) => {
  // Multi-channel past
  return way.before(hist, t, size)
};

exports.future = (hist, t, size) => {
  // Multi-channel future
  return way.after(hist, t, size)
};

exports.moment = (hist, t, pastSize, futureSize) => {
  // Multi-channel moment
  return {
    t: t,
    past: way.before(hist, t, pastSize),
    future: way.after(hist, t, futureSize)
  }
};

exports.similarity = (a, b) => {
  // Similarity score between two multi-channel history slices.
  return way.reduce(a, (acc, aq, c, t) => {
    const bq = b[c][t];
    const score = Math.min(aq, bq);
    // Alternatives for scoring:
    //   1 - Math.abs(x - y);
    //   Math.min(x, y);
    return acc + score;
  }, 0);
};

exports.predict = (hist, context, distance) => {
  // Assert hist.length === context.length

  const channels = context.length;
  const contextSize = context[0].length;
  const historySize = hist[0].length;
  const futureSize = distance;

  // No reason to include moments where the future is about to be predicted.
  const times = lib.range(Math.max(0, historySize - futureSize + 1));
  var moments = times.map(t => {
    return exports.moment(hist, t, contextSize, futureSize);
  });

  var weights = moments.map(m => {
    var sim = exports.similarity(m.past, context);
    return sim * sim;
  });

  let weightSum = lib.arraySum(weights);

  const accum = context.map(() => lib.zeros(futureSize));

  let normalized = moments.reduce((pred, m, t) => {
    return lib.multiAdd(pred, lib.multiScale(m.future, weights[t] / weightSum))
  }, accum);

  let maxLikelihood = lib.multiRound(normalized);

  return {
    moments,
    weights,
    probabilities: normalized,
    prediction: maxLikelihood
  };
};
