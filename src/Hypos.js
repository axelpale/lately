// A warehouse of hypotheses about the next event.

var SortedSet = require('redis-sorted-set');
var Categorical = require('./Categorical');
var Decaying = require('./Decaying');
var params = require('./parameters');

var hash = function (evec) {
  // Hash event vector
  return evec.join('//');
};

var maturity = function (h) {
  // Maturity of hypothesis, a number in range 0..1.
  //
  // Background:
  //   A categorical distribution has a Dirichlet distribution
  //   as its conjugate prior. The Dirichlet distribution gives
  //   us the variance of the probabilities that form
  //   the estimated categorical distribution [1]:
  //
  //   Var(P_i) = a_i * (a_0 - a_i) / (a_0**2 * (a_0 + 1))
  //
  //   Example 1: given a sample [A, A, B, C]:
  //     a_A = 2
  //     a_B = 1
  //     a_C = 1
  //     a_0 = 4
  //     E(P_A) = 2/4
  //     Var(P_A) = 2 * (4 - 2) / (4*4 * 5)
  //              = 4 / 80 = 1 / 20
  //              = 0.05
  //     Var(P_B) = 1 * 3 / 80 = 3 / 80
  //              = 0.0375
  //
  //   Example 2: given a sample [A, A, A, A, B]:
  //     Var(P_A) = 4 / (25 * 6) = 4 / 150
  //              = 0.0266...
  //              = Var(P_B)
  //
  //   We note that the variances of probabilities are about same in size
  //   regardless the index. Thus, we could take an average of variances.
  //
  //   Average variance for the example 1 would be:
  //     E(Var(P_i)) = (1 / a_0) * Sum_i( Var(P_i) )
  //                 = (1 / a_0) * (a_0 * Sum_i(a_i) - Sum_i(a_i**2))
  //                   / (a_0**2 * (a_0 + 1))
  //                 = (1 / a_0) * (a_0 * a_0 - Sum_i(a_i**2))
  //                   / (a_0**2 * (a_0 + 1))
  //                 = 1 / (a_0 * (a_0 + 1))
  //                   - Sum_i(a_i**2) / (a_0**3 * (a_0 + 1))
  //
  //
  //   On the other hand, the mean squared error of a variable
  //   equals its estimated variance, given that variance estimator
  //   is unbiased. [2]
  //
  //
  //
  //
  // References:
  //   [1] https://en.wikipedia.org/wiki/Dirichlet_distribution
  //   [2] https://en.wikipedia.org/wiki/Mean_squared_error

  var sampleSize = h.weightSum();

  if (sampleSize < 1) {
    return 0;
  }

  return 1 - 1 / Math.sqrt(sampleSize);
};

var reward = function (p, prior) {
  // The greater the p to prior, the bigger the reward.
  // If p is smaller than prior, returns negative.
  // The difference in the low or high end of the probability range
  // yields greater rewards than in around 0.5.
  return Math.log(p / (1 - p)) - Math.log(prior / (1 - prior));
};

var weight = function (dist, w) {
  // Multiply distribution values by w.
  // Dist is mapping evName -> number

  var d = {};

  var k;
  for (k in dist) {
    if (dist.hasOwnProperty(k)) {
      d[k] = w * dist[k];
    }
  }

  return d;
};


// Constructor

var H = function () {

  // Mapping from events to hypotheses
  //   string -> Categorical
  this.hypos = {};

  // Scores, rewards
  // Create or replace rewards by:
  //   this.rewards.add(key, value).
  // The keys are kept in order based on the value.
  this.rewards = new SortedSet();

  // Prior probability distribution for context events.
  this.cevPrior = new Decaying(params.R);
  // Prior probability distribution for events.
  this.evPrior = new Decaying(params.R);
};

// Private methods


// Public methods

H.prototype.ensureHypo = function (eventVector) {
  var h = hash(eventVector);

  if (this.hToHypo.hasOwnProperty(h)) {
    return this.hToHypo[h];
  }

  this.hToHypo[k] = new Categorical();
  this.hToHypo[k].hash = h;
  return this.hToHypo[k];
};

H.prototype.getHypo = function (cev) {
  // Parameters:
  //   cev
  //     context event, string
  if (this.hypos.hasOwnProperty(cev)) {
    return this.hypos[h];
  }
  return null;
};

H.prototype.getHypos = function (cevs) {
  // Parameters:
  //   cevs
  //     context events, array of strings
  //
  // Returns a set of hypotheses that match the context.
  // The returned set might have different size than given array.

  var self = this;
  return cevs.map(function (cev) {
    return self.getHypo(cev);
  }).filter(function (hypo) {
    return hypo !== null;
  });
};

H.prototype.learn = function (cevs, evs) {
  // Parameters
  //   cevs
  //     context events, the event history. These define the set of
  //     hypotheses that predict the current events (evs) given cevs.
  //   evs
  //     events to learn, the current events. These also define the set of
  //     hypotheses that predict other evs given ev in evs.
  //
  // Return
  //   A Categorical, reward distribution of the rewarded hypos

  var self = this;

  // We reward hypos based on this new evidence from the world.
  // We reward a hypo if its prediction is better than current
  // average prediction (prior knowledge). We compute this prior
  // by summing up the posterior probability distributions of
  // active hypo. Probability distributions of rare events
  // have more weight.
  var prediction = cevs.reduce(function (acc, cev) {
    var h, p, d;

    h = self.getHypo(cev);
    m =
    p = self.cevPrior.prob(cev);
    if (h) {
      d = h.getProbDist();
    }
    acc.learn(h.getProbDist(), Math.min(100, 1 / p));
    return acc;
  }, new Categorical());

  // Reward each mature and active hypo according to
  // - it's prediction probability. Better probability leads to better reward.
  // - hypo's prior probability to be active. Commonly active hypos should
  //   receive less reward than rare hypotheses.
  //   It is the same as the prior probability of the context (evecs).
  // - ev's prior probability. More common the ev, less reward it should get.
  //   Otherwise average hypotheses would win all.
  //
  // This manipulates rewards.
  var forwardReward = cevs.reduce(function (acc, cev) {
    var h = self.getHypo(cev);

    // Reward only mature hypos.
    var p = h.prob(evs);
    var pp = prediction.prob(evs);

    acc[cev] = reward(p, pp);
    return acc;
  }, {});

  // We reward also hypos about the events happening at the same time.
  // var lateralHypos = this.getHypos(evs);
  // var lateralPrior = lateralHypos.reduce(function (acc, h) {
  //   acc.learn(h.getProbDist());
  //   return acc;
  // }, new Categorical());
  //
  // // Reward hypos that correctly estimate the members of evs.
  // var lateralReward = evs.reduce(function (acc, ev, index) {
  //   var h = self.getHypo(ev);
  //
  //   // No reason to predict itself because its always there.
  //   var others = evs.filter(function (e, i) {
  //     return i !== index;
  //   });
  //
  //   var avgp = others.reduce(function (acc, oev) {
  //     return acc += h.prob(oev) / others.length;
  //   }, 0);
  //
  //   lateralPrior.prob()
  //
  //   acc[ev] = reward(avgp, )
  //   return acc;
  // }, {});

  self.rewards.learn(forwardReward, 1.0);

  // Show the event to the matching hypotheses.
  // This manipulates hypotheses.
  eventVectors.forEach(function (evec) {
    var h = self.ensureHypo(evec);
    h.learn(ev);
  });

  // Record prior probability of eventVectors and events.
  // This manipulates priors.
  hypos.forEach(function (hypo) {
    this.hypoPrior.learn(hypo.hash);
  });
  this.evPrior.learn(ev);

  return new Categorical(rewardDist);
};

H.prototype.predict = function (eventVectors, priorHypoDist) {
  // Get likelihood distribution for the next event based on
  // the contents of the windows alias context.
  // This is done by weighted sum of the hypotheses.
  //
  // Parameters:
  //   eventVectors
  //     array of event vectors
  //   priorHypoDist (optional)
  //     dist of hypotheses to weight in prediction.
  //     This weight is added in, not multiplied in.
  //
  // Return
  //   a Categorical

  var hypos = this.getHypos(eventVectors);
  return hypos.reduce(function (acc, hypo) {
    // Weight by competence.
    var we = self.rewards.prob(hypo.hash);

    // Duplicate the weights of hypos that are
    // predicted by the higher layer.
    if (priorHypoDist.hasOwnProperty(hypo.hash)) {
      we += priorHypoDist[hypo.hash];
    }

    return acc.addMass(weight(hypo.getProbDist(), we));
  }, new Categorical());
};

module.exports = H;
