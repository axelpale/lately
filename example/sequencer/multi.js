// Multi-channel binary predictor
//
const lib = require('./lib');

var past = (hist, t, size) => {
  // Multi-channel past
  return hist.map(channel => lib.pastSingle(channel, t, size))
};

var future = (hist, t, size) => {
  // Multi-channel future
  return hist.map(channel => lib.futureSingle(channel, t, size))
};

var moment = (hist, t, pastSize, futureSize) => {
  // Multi-channel moment
  return {
    t: t,
    past: past(hist, t, pastSize),
    future: future(hist, t, futureSize)
  }
};

var similaritySingle = (a, b) => {
  // Single channel slice similarity.
  const scores = a.map((x, i) => {
    const y = b[i];
    return 1 - Math.abs(x - y);
  });
  return lib.arraySum(scores);
};

var similarity = (a, b) => {
  // Similarity score between two multi-channel history slices.
  const chanScores = a.map((chanx, i) => {
    const chany = b[i];
    return similaritySingle(chanx, chany);
  });
  return lib.arraySum(chanScores);
};

const printSlice = (slice) => {
  slice.forEach(channel => console.log(channel));
};

var predict = (hist, context, distance) => {
  const contextSize = context[0].length;
  const futureSize = distance;

  var moments = hist[0].map((ev, t) => {
    return moment(hist, t, contextSize, futureSize);
  });

  var weights = moments.map((m) => {
    return similarity(m.past, context);
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

// Testing

const history = [
  [1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0], // sun up
  [0,1,1,1,0,0,0,0,1,1,0,0,0,0,1,1,1,0,0,1,1,1,0,0] // flower open
];

console.log('past', past(history, 3, 2));
console.log('future', future(history, 3, 2));
console.log('moment', moment(history, 3, 2, 2));

{
  console.log('');
  let a = past(history, 3, 2);
  let b = past(history, 9, 2);
  let sim = similarity(a, b);
  console.log('similarity(a, b) =', sim + ', where');
  console.log('a');
  printSlice(a);
  console.log('b');
  printSlice(b);
}

{
  console.log('');
  let t = history[0].length
  let distance = 2
  let context = past(history, t, 3)
  let pred = predict(history, context, distance);
  console.log('predict', distance);
  console.log('  in context', JSON.stringify(context));
  pred.moments.forEach((mom, index) => {
    let w = JSON.stringify(mom.past) + JSON.stringify(mom.future);
    console.log('  t=' + mom.t + ':', w, 'simil=' + pred.weights[index]);
  });
  console.log('  prediction:', JSON.stringify(pred.prediction));
}
