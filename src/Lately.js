
// Learning
// --------
// Active hypotheses predict the next event X.
// A new event appears B. The event B is fed to the bottommost layer.
// Some hypotheses were more correct than others in predicting B.
// The correct hypotheses are rewarded, according to the predicted probability.
// Reward gives them a better position in a decaying cat distribution.
//   Critic: is there a decaying for each possible set of active hypotheses?
//   Hypotheses that are active more often should not receive more reward
//   than rarely active correct hypos.
//   Thus: keep a distribution of hypotheses activity and normalize rewards
//     according to this prior probability..
//   Thus: hypo's reward share: it's prediction prob / it's prior.
//     A hypo that is active 1/10 of the time receives 10 times higher reward
//     than hypo that is active all the time.
//   Thus: put the rewards into a categorical distribution to normalize to one,
//     and then increase their score in a decaying. A decaying because
//     we allow the reward distribution to change.
// C most correct predictions are turned into higher-layer events: P->B
// Correct prediction on a higher layer should reward the causes on the level
// below (backpropagation). No, why?
// Predictions on higher layer should weight hypotheses on lower layer.
//   This conditional weighting allows modification of prediction distribution
//   when a state changes on higher level.
// Hypotheses with low reward score are reset by emptying the distribution
// they have collected. This allows new more correct distributions to arise.

// Predicting
// ----------
// The next event is predicted by a weighted sum of layer's active hypotheses,
// weighted by their probability in the reward distribution (a decaying).
// Predictions on higher layer further modulate the weight. Higher layer
// predicts correct predictions on lower layer, and thus more weight is given
// to those low hypotheses that have been correct in the past.
// The weights of hypotheses are multiplied by their probability given from
// the higher layer prediction.

// Performance score
// -----------------
// number of correct predictions / max number of correct predictions

// Problems ahead
// --------------
// Number of event names increases by each layer. Given 16 windows and 8 atomic
// events:
// 1st layer: 2^4 * 2^3 hypotheses, 2^10 possible predictions i.e. event names
// 2st layer: 2^4 * 2^10 hypotheses, 2^14 * 2^10 possible event names
// 3st layer: 2^4 * 2^24 hypotheses, 2^28 * 2^24 possible event names
// ...
//
// Thus, we cannot keep all the possible event names in memory.
// Thus, we need to forget some of the events even in the last window.
// Probably not a problem because only a small set of correct predictions
// are exposed.

// Detecting active hypotheses
// ---------------------------
// Each window has categorical distribution.
// We can ask window for events with mass higher than a threshold.
//   Returns a list of [event,index] pairs
// We can ask Hypothesis Pool for hypotheses regarding these pairs.
//   Returns a list of hypotheses.

// Forgetting hypotheses
// ---------------------
// If a pair leaves a window, no hypothesis is removed because the hypos
// are the memory for the next similar situation.
// But due to huge number of possible events, some events realize only once.
// Thus there should be a forget rule for hypotheses:
//   if event does not happen within 2^F steps,
//     and the hypothesis is not tested,
//   then remove the hypothesis.
//   It will be recreated if the event happens again.
//   However, the previous statistics were now forgotten.
// Alternative forget rule for hypotheses:
//   In the hypothesis reward distribution, the hypos with lowest reward
//   are destroyed to accommodate only H best hypotheses.
//   Untested hypos should have a higher score than failed hypos.
// Energy approach:
//   Each hypothesis consumes energy.
//   Active hypothesis consumes more energy than inactive one.
//   When correct, consumption of energy is more allowed.
//   The correct hypothesis is given more resources.

// Multiple hypos per pattern
// --------------------------
// Immutable probability distributions.
// Mutate by learning.
//

var Layer = require('./Layer');


var L = function () {
  this.layer = new Layer();
};

L.prototype.feed = function (ev) {
  this.layer.feed(ev);
};

L.prototype.predict = function () {
  return this.layer.predict().toProbDist();
};
