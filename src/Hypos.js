// A warehouse of hypotheses about the next event.

var Categorical = require('./Categorical');
var Decaying = require('./Decaying');
var params = require('./parameters');
var maturity = require('./lib/maturity');

var SortedSet = require('redis-sorted-set');

var reward = function (prior, p) {
  // The greater the p to prior, the bigger the reward.
  // If p is smaller than prior, returns negative.
  // The difference in the low or high end of the probability range
  // yields greater rewards than in around 0.5.
  return Math.log(p / (1 - p)) - Math.log(prior / (1 - prior));
};

var competence = function (key, sortedSet) {
  // Return a number between 0..1 so that the higher the rank,
  // the closer the number to 1. The key with the highest value will
  // have weight of 1.0.
  //
  // Parameters:
  //   key
  //     A key in a sorted set.
  //   sortedSet
  //     A redis sorted set
  //
  var rank = sortedSet.rank(key);
  var n = sortedSet.length;

  if (n === 0) {
    return 0;
  }

  if (rank >= 0) {
    if (rank === 1) {
      return 1;
    }

    return rank / (n - 1);
  }

  // Key not ranked
  return 0;
};


// Constructor

var H = function () {

  // Mapping from events to hypotheses
  //   string -> Categorical
  this.hypos = {};

  // Scores, rewards
  // Create or replace a reward by:
  //   this.rewards.add(key, value)
  // Get the ranking of a key:
  //   this.rewards.rank(key)
  // Get the size of the set:
  //   this.rewards.length
  // The keys are kept in order based on the value.
  this.rewards = new SortedSet();

  // Prior probability distribution for context events.
  this.cevPrior = new Decaying(params.R);
};

// Private methods


// Public methods

H.prototype.ensureHypo = function (cev) {

  if (this.hypos.hasOwnProperty(cev)) {
    return this.hypos[cev];
  }

  // Create
  var c = new Categorical();
  this.hypos[cev] = c;

  return c;
};

H.prototype.getHypo = function (cev) {
  // Parameters:
  //   cev
  //     context event, string
  if (this.hypos.hasOwnProperty(cev)) {
    return this.hypos[cev];
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


H.prototype.learn = function (cevs, ev) {
  // Parameters
  //   cevs
  //     context events, the event history. These define the set of
  //     hypotheses that predict the current event (ev) given cevs.
  //   ev
  //     event to learn, the current event.
  //
  // Return
  //   A Categorical, reward distribution of the rewarded hypos

  var self = this;

  // We reward a hypo if its prediction is better than current
  // average prediction (prior knowledge).
  var prediction = self.predict(cevs);

  // Reward each mature and active hypo according to
  // - it's prediction probability. Better probability leads to better reward.
  // - hypo's prior probability to be active. Commonly active hypos should
  //   receive less reward than rare hypotheses.
  //   It is the same as the prior probability of the context (evecs).
  // - ev's prior probability. More common the ev, less reward it should get.
  //   Otherwise average hypotheses would win all.
  //
  // This manipulates rewards.
  var rewards = cevs.reduce(function (acc, cev) {
    var h = self.getHypo(cev);

    if (h) {
      var pp = prediction.prob(ev);
      var p = h.prob(ev);

      acc[cev] = maturity(h) * reward(pp, p);
    }
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

  Object.keys(rewards).forEach(function (key) {
    var currentReward, newReward;

    if (self.rewards.has(key)) {
      currentReward = self.rewards.get(key);
      self.rewards.add(key, currentReward + newReward);
    } else {
      self.rewards.add(key, newReward);
    }
  });

  // Teach the new event to active hypos.
  // This manipulates hypos.
  cevs.forEach(function (cev) {
    var h = self.ensureHypo(cev);
    h.learn(ev);
  });

  // Record prior probability of context events.
  // This manipulates priors.
  cevs.forEach(function (cev) {
    self.cevPrior.learn(cev);
  });
};


H.prototype.predict = function (cevs) {
  // Get likelihood distribution for the next event based on
  // the contents of the windows alias context.
  // This is done by weighted sum of the hypotheses.
  //
  // We compute this prediction
  // by summing up the posterior probability distributions of
  // hypos. Probability distributions of rare events
  // have more weight.
  //
  // Parameters:
  //   cevs
  //     array of context events
  //
  // Return
  //   a Categorical
  //
  var self = this;

  return cevs.reduce(function (acc, cev) {
    var h, m, c, pp, d, w;

    h = self.getHypo(cev);

    if (h) {
      m = maturity(h);
      c = competence(cev, self.rewards);
      pp = self.cevPrior.prob(cev);

      // Weight of the hypo's prediction.
      // If hypo's context has not been observed yet or
      // it has been forgotten, prior probability is zero.
      // A prediction in this situation would be so vague
      // that it is better to give weight 0.
      if (pp === 0) {
        w = 0;
      } else {
        w = m * c / pp;
      }

      d = h.getProbDist();
      acc.learn(d, w);
    }
    return acc;
  }, new Categorical());
};

module.exports = H;
