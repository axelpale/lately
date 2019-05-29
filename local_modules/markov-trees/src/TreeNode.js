var Categorical = require('./Categorical');

var N = function (evId) {
  this.evId = evId;
  this.parent = null;
  this.children = new Categorical();
  this.evIdToChild = {};
  this.label = {};  // For custom data
};

N.prototype.addChild = function (childNode) {
  this.children.learn(childNode.evId);
  this.evIdToChild[childNode.evId] = childNode;
};

N.prototype.forEachChild = function (iteratee, ctx) {
  // Parameters:
  //   iteratee
  //     function (childNode, probability, numObservations)
  //   ctx (optional, default undefined)
  //     calling context of iteratee
  this.children.forEach(function (childEvId, childProb, childMass) {
    var childNode = this.evIdToChild[childEvId];
    iteratee.call(ctx, childNode, childProb, childMass);
  }, this);
};

N.prototype.get = function (key) {
  // Return
  //   value stored to key
  //   undefined if does not exist
  return this.label[key];
};

N.prototype.getDepthFromRoot = function () {
  if (this.parent === null) {
    return 0;
  }
  return this.parent.getDepthFromRoot() + 1;
};

N.prototype.getGain = function (priorNode) {
  // Information gain i.e. Kullback-Leibler divergence from
  // prior node's child distribution to this node's child distribution.
  return this.children.divergenceFrom(node.children);
};

N.prototype.getEventId = function () {
  return this.evId;
};

N.prototype.getParent = function () {
  return this.parent;
};

N.prototype.getRoot = function () {
  if (this.parent === null) {
    return this;
  }
  return this.parent.getRoot();
};

N.prototype.hasChild = function (childNode) {
  return this.evIdToChild.hasOwnProperty(childNode.evId);
};

N.prototype.hasPath = function (evIdArray) {
  // Return
  //   bool
  //     true if has predecessor blood line as in evIdArray
  //     false otherwise
  if (evIdArray.length === 0) {
    return true;
  }

  var nextEvId = evIdArray.unshift();
  if (this.evIdToChild.hasOwnProperty(nextEvId)) {
    return this.evIdToChild[nextEvId].hasPath(evIdArray);
  }
  return false;
};

N.prototype.isMature = function () {
  // Is able to have children?

  if (this.parent === null) {
    return true;
  }

  return this.parent.children.weight(this.evId) > 1;
};

N.prototype.isLeaf = function () {
  return this.children.mass() === 0;
};

N.prototype.isRoot = function () {
  return this.parent === null;
};

N.prototype.set = function (key, value) {
  // Return
  //   undefined if key does not exist.
  var oldValue = this.label[key];
  this.label[key] = value;
  return oldValue;
};


module.exports = N;
