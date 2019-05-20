// Multi-channel binary predictor
//
const lib = require('./lib');
const binaryEntropy = require('./binaryEntropy');
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

exports.gain = binaryEntropy;

exports.similarity = (a, b, apriori) => {
  // Similarity score between two multi-channel history slices.
  return way.reduce(a, (acc, aq, c, t) => {
    const bq = b[c][t];

    // Alternatives for scoring:
    //   1 - Math.abs(aq - bq);
    //   Math.min(aq, bq);
    const score = 1 - Math.abs(aq - bq);

    // Weight in the info gain.
    // Otherwise full ones or zeros will get huge weight.
    const p = apriori[c][0];
    // Binary entropy function
    const gain = binaryEntropy(p);

    return acc + score * gain;
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

  const apriori = way.mean(hist);

  var weights = moments.map(m => {
    var sim = exports.similarity(m.past, context, apriori);
    return sim * sim;
  });

  let weightSum = lib.arraySum(weights);

  const accum = context.map(() => lib.zeros(futureSize));

  let normalized = moments.reduce((pred, m, t) => {
    return way.add(pred, way.scale(m.future, weights[t] / weightSum));
  }, accum);

  let maxLikelihood = way.map(normalized, q => Math.round(q));

  return {
    moments,
    weights,
    probabilities: normalized,
    prediction: maxLikelihood
  };
};
