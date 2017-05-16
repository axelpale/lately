// A warehouse of hypotheses about the next event.

var Categorical = require('./Categorical');
var Decaying = require('./Decaying');
var params = require('./parameters');

var hash = function (evec) {
  // Hash event vector
  return evec.join('//');
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

  // Mapping from event vector hashes to hypotheses
  this.hToHypo = {};

  // Scores, rewards
  // Use: rewards.prob(hypo.hash)
  this.rewards = new Decaying(params.R);

  // Prior probability distribution for hypo activeness.
  this.hypoPrior = new Decaying(params.R);
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

H.prototype.getHypo = function (eventVector) {
  var h = hash(eventVector);
  if (this.hToHypo.hasOwnProperty(h)) {
    return this.hToHypo[h];
  }
  return null;
};

H.prototype.getHypos = function (eventVectors) {
  // The set of event vectors is the context.
  // Array of arrays.
  // Returns a set of hypotheses that match the context.
  // The returned set might have different size.
  var self = this;
  return eventVectors.map(function (evec) {
    return self.getHypo(evec);
  }).filter(function (hypo) {
    return hypo !== null;
  });
};

H.prototype.learnLateral = function (evs) {

  var hypos = this.getLateralHypos(evs);

  for each ev in evs {
    var h = this.getHypo(ev);
    var p = h.prob(ev);
    var ep = self.evPrior.prob(ev);
  }

  self.rewards.learn(rewardDist, 1.0);
};

H.prototype.learn = function (cevs, evs) {
  // Parameters
  //   cevs
  //     context events, the event history. These define the set of
  //     hypotheses that predict the current events (evs) given cevs.
  //   evs
  //     events to learn, the current events. These also define the set of
  //     hypotheses that predict other evs given ev in evs.
  // Return
  //   A Categorical, reward distribution of the rewarded hypos

  var self = this;
  var hypos = this.getHypos(eventVectors);

  // Reward each active hypo according to
  // - it's prediction probability. Better probability leads to better reward.
  // - hypo's prior probability to be active. Common hypotheses should
  //   receive less reward than rare hypotheses.
  //   It is the same as the prior probability of the context (evecs).
  // - ev's prior probability. More common the ev, less reward it should get.
  //   Otherwise average hypotheses would win all.
  //
  // This manipulates rewards.
  var forwardReward = cevs.reduce(function (acc, cev) {
    var h = self.getHypo(cev);
    var p = h.prob(ev);
    var cp = self.cevPrior.prob(cev);  // Context prior
    var ep = self.evPrior.prob(ev);

    acc[cev] = p / Math.max(0.01, cp * ep);
    return acc;
  }, {});

  // Reward hypos that correctly estimate the members of evs.
  var lateralReward = evs.reduce(function (acc, ev, index) {
    var h = self.getHypo(ev);

    // No reason to predict itself because its always there.
    evs.filter(function (e, i) {
      return i !== index;
    });

    var p = h.prob(ev);
    var ep = self.evPrior.prob(ev);

    acc[ev] = p / Math.max(0.01, ep);
    return acc;
  }, {});

  self.rewards.learn(rewardDist, 1.0);

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
