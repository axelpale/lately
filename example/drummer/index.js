// Single-channel binary predictor.
var lib = require('./lib')

var seq = [1,0,1,0,1,1,0,1,0,1]

var past = lib.pastSingle
var future = lib.futureSingle

var moment = (hist, t, pastSize, futureSize) => {
  return {
    t: t,
    past: past(hist, t, pastSize),
    future: future(hist, t, futureSize)
  }
};

var similarity = (w0, w1) => {
  // Here: number of matches
  const elemWise = lib.arrayNor(w0, w1);
  return lib.arraySum(elemWise);
};

var predict = (hist, contextSize, futureSize) => {
  var tCur = hist.length;
  var context = past(hist, tCur, contextSize);

  var moments = hist.map((ev, t) => {
    return moment(hist, t, contextSize, futureSize);
  });

  var weights = moments.map((m) => {
    return similarity(m.past, context);
  });

  let weightSum = lib.arraySum(weights);

  let normalized = moments.reduce((pred, m, t) => {
    return lib.arrayAdd(pred, lib.arrayScale(m.future, weights[t] / weightSum))
  }, lib.zeros(futureSize));

  let maxLikelihood = lib.arrayRound(normalized)

  return {
    context,
    moments,
    weights,
    likelihoods: normalized,
    prediction: maxLikelihood
  };
}

console.log('arrayAdd', lib.arrayAdd([0, 1], [1, 2]));
console.log('arrayMultiply', lib.arrayMultiply([0, 1], [1, 1]));

console.log('past', past(seq, seq.length, 2))
console.log('future', future(seq, 0, 2))
console.log('moment', moment(seq, 4, 2, 1))

let pred = predict(seq, 2, 2);
console.log('predict', pred.prediction.length)
console.log('  in context', JSON.stringify(pred.context))
pred.moments.forEach((mom, index) => {
  let w = JSON.stringify(mom.past) + JSON.stringify(mom.future);
  console.log('  t=' + mom.t + ':', w, 'sim=' + pred.weights[index]);
})
console.log('  prediction:', JSON.stringify(pred.prediction));
