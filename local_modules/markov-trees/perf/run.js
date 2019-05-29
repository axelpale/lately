var ZeroOrder = require('../src/ZeroOrder');
var sequences = require('./sequences');

var run = function () {
  // Algorithm:
  //   for each test sequence
  //     for each item in sequence
  //       for each predictor
  //         feed previous item and get prediction
  //         score the prediction according to the item
  //         add the score to the total score of predictor
  //

  var sequenceNames = [
    'ab',
    'noise',
    'unfair100',
  ];
  var predictorClasses = [
    ZeroOrder,
  ];

  var scoreFn = function (prob) {
    return prob;
  };

  sequenceNames.forEach(function (seqName) {
    sequences.load(seqName, function (err, seq) {
      if (err) {
        console.error(err);
        return;
      }

      console.log('###');
      console.log('sequence:', seqName);

      predictorClasses.forEach(function (PredictorClass) {
        var predictor = new PredictorClass();
        var i, prev, next, prediction, prob;
        var totalScore = 0;

        for (i = 1; i < seq.length; i += 1) {
          prev = seq[i - 1];
          prediction = predictor.feed(prev);
          next = seq[i];

          prob = prediction.prob(next);
          totalScore += scoreFn(prob);
        }

        // Reflect class name. See https://stackoverflow.com/a/10314492/638546
        var predictorName = predictor.constructor.name;

        // Expected score for this predictor given this sequence.
        var meanScore = totalScore / (seq.length - 1);

        // Report results
        console.log('predictor:', predictorName);
        console.log('  score:', meanScore);
      });
    });
  });
};

run();
