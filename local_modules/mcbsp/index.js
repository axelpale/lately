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
  // Assert way.width(hist) === way.width(context)

  const channels = context.length;
  const historySize = hist[0].length;
  const contextSize = Math.min(historySize, context[0].length);
  const futureSize = Math.min(historySize, distance);

  // Trim context to history size
  context = way.last(context, contextSize)

  // No reason to include moments where the future is about to be predicted.
  // We match the context, so the begin can be partial. It might be the best.
  // Range begin = 0 => first moment has only zeros.
  const times = lib.range(0, historySize - futureSize);
  var moments = times.map(t => {
    return exports.moment(hist, t, contextSize, futureSize);
  });

  const apriori = way.mean(hist);

  // Compute weights for each moment based on how well they matched the context
  moments = moments.map(m => {
    return Object.assign({
      weight: exports.similarity(m.past, context, apriori)
    }, m)
  });

  // Sort to pick the best. Best first.
  const sorted = moments.slice().sort((m0, m1) => {
    return m1.weight - m0.weight;
  });
  const middleAt = Math.floor(sorted.length / 2);
  const median = sorted[middleAt];

  const weightMedian = (sorted.length % 2 === 0) ?
    (sorted[middleAt - 1].weight + sorted[middleAt].weight) / 2 :
    median.weight;

  // Pick weights above median weight. NOTE modifies moments.
  moments.forEach(m => {
    m.weight = Math.max(0, m.weight - weightMedian);
  });

  // Keep only up to n best
  const best = sorted.slice(0, 3);

  const weightSum = lib.arraySum(best.map(m => m.weight));

  const accum = context.map(() => lib.zeros(futureSize));
  const normalized = best.reduce((pred, m, t) => {
    const scale = weightSum > 0 ? m.weight / weightSum : 0;
    return way.add(pred, way.scale(m.future, scale));
  }, accum);

  const maxLikelihood = way.map(normalized, q => Math.round(q));

  return {
    moments: best,
    weights: best.map(m => m.weight),
    probabilities: normalized,
    prediction: maxLikelihood
  };
};

exports.pattern = require('./pattern');
