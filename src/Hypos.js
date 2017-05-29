// A warehouse of hypotheses about the next event.

var Categorical = require('./Categorical');
var Decaying = require('./Decaying');
var Bernoulli = require('./Bernoulli');
var maturity = require('./lib/maturity');
var competence = require('./lib/competence');
var reward = require('./lib/reward');

var SortedSet = require('redis-sorted-set');



// Constructor

var H = function () {

  // Mapping from condition events to hypotheses
  //   string -> Categorical
  this.hypos = {};

  // Scores, rewards
  // Create or replace a reward by:
  //   this.rewards.add(key, value)
  // Get the ranking of a key:
  //   this.rewards.rank(key)
  // Get the size of the set:
  //   this.rewards.card()
  // The keys are kept in order based on the value.
  this.rewards = new SortedSet();

  // Prior probability distribution for context events, i.e. layer i+1 events.
  this.cevPrior = new Bernoulli();
  // Prior probability distribution for new events, i.e. layer i events.
  this.evPrior = new Bernoulli();
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
  //     context event i.e. the condition, string
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

H.prototype.inspect = function () {

  var self = this;

  var hypos = Object.keys(this.hypos).reduce(function (acc, cev) {
    var h = self.hypos[cev];

    acc[cev] = {
      competence: competence(cev, self.rewards),
      dist: h.getProbDist(),
      mass: h.mass(),
      maturity: maturity(h),
      prior: self.cevPrior.prob(cev),
      reward: self.rewards.score(cev),
    };

    return acc;
  }, {});

  var rews = self.rewards.toArray({ withScores: true });

  return {
    hypos: hypos,
    rewards: rews,
  };
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

  //console.log('### .learn begin');

  var self = this;

  // We reward a hypo if its prediction is better than current
  // average prediction (prior knowledge).
  var prediction = self.predict(cevs);
  var prior = prediction.prob(ev);

  //console.log('cevs', cevs);
  //console.log('prediction prior', prior);

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
    var h, p, m, r, s;
    h = self.getHypo(cev);

    if (h) {
      p = h.prob(ev);
      m = maturity(h);
      r = reward(prior, p);
      s = m * r;

      //console.log(' ', cev);
      //console.log('  h.prob(ev)', p);
      //console.log('  maturity(h)', m);
      //console.log('  reward(prior, p)', r);
      //console.log('  final reward', s);

      acc[cev] = s;
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

  console.log('rewards', rewards);

  Object.keys(rewards).forEach(function (key) {
    self.rewards.incrBy(rewards[key], key);
  });

  console.log('self.rewards.toArray()', self.rewards.toArray({
    withScores: true,
  }));

  // Teach the new event to active hypos.
  // This manipulates hypos.
  cevs.forEach(function (cev) {
    var h = self.ensureHypo(cev);
    h.learn(ev);
  });

  // Record prior probability of a context event to be active.
  // This manipulates priors.
  self.cevPrior.learn(cevs);
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

  console.log('#### .predict begin');

  return cevs.reduce(function (acc, cev) {
    var h, m, c, pp, d, w;

    console.log('cev:', cev);

    h = self.getHypo(cev);

    if (h) {
      m = maturity(h);
      c = competence(cev, self.rewards);
      pp = self.cevPrior.prob(cev);

      console.log('hypo:', h.getProbDist());
      console.log('mass:', h.mass());
      console.log('maturity:', m);
      console.log('competence:', c);
      console.log('prior:', pp);

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

      //console.log('weight:', w);

      d = h.getProbDist();
      acc.learn(d, w);
    }
    return acc;
  }, new Categorical());
};

module.exports = H;
