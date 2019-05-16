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
  const scores = a.map((x, i) => {
    const y = b[i];
    return 1 - Math.abs(x - y);
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
  const contextSize = context[0].length;
  const futureSize = distance;

  var moments = hist[0].map((ev, t) => {
    return exports.moment(hist, t, contextSize, futureSize);
  });

  var weights = moments.map((m) => {
    return exports.similarity(m.past, context);
  });

  let weightSum = lib.arraySum(weights);

  const accum = [
    lib.zeros(futureSize),
    lib.zeros(futureSize)
  ];

  let normalized = moments.reduce((pred, m, t) => {
    return lib.multiAdd(pred, lib.multiScale(m.future, weights[t] / weightSum))
  }, accum);

  let maxLikelihood = lib.multiRound(normalized);

  return {
    moments,
    weights,
    likelihoods: normalized,
    prediction: maxLikelihood
  };
};
