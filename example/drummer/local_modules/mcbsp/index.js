// Multi-channel binary predictor
//
const lib = require('./lib');

exports.past = (hist, t, size) => {
  // Multi-channel past
  return hist.map(channel => lib.pastSingle(channel, t, size))
};

exports.future = (hist, t, size) => {
  // Multi-channel future
  return hist.map(channel => lib.futureSingle(channel, t, size))
};

exports.moment = (hist, t, pastSize, futureSize) => {
  // Multi-channel moment
  return {
    t: t,
    past: exports.past(hist, t, pastSize),
    future: exports.future(hist, t, futureSize)
  }
};

exports.similaritySingle = (a, b) => {
  // Single channel slice similarity.
  //
  // Alternatives for scoring:
  //   1 - Math.abs(x - y);
  //   Math.min(x, y);
  //
  const scores = a.map((x, i) => {
    const y = b[i];
    return Math.min(x, y);
  });
  return lib.arraySum(scores);
};

exports.similarity = (a, b) => {
  // Similarity score between two multi-channel history slices.
  const chanScores = a.map((chanx, i) => {
    const chany = b[i];
    return exports.similaritySingle(chanx, chany);
  });
  return lib.arraySum(chanScores);
};

exports.predict = (hist, context, distance) => {
  // Assert hist.length === context.length

  const channels = context.length;
  const contextSize = context[0].length;
  const historySize = hist[0].length;
  const futureSize = distance;

  // No reason to include moments where the future is about to be predicted
  const times = lib.range(historySize - futureSize);
  var moments = times.map(t => {
    return exports.moment(hist, t, contextSize, futureSize);
  });

  var weights = moments.map(m => {
    var sim = exports.similarity(m.past, context);
    return sim;
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
