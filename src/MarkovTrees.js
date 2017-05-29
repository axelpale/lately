var Decaying = require('./Decaying');
var params = require('./parameters');

// Map Event names to unique integers and vice versa.
var str2int = {};
var int2str = {};
var idCounter = 0;
var stringToInteger = function (str) {
  if (str2int.hasOwnProperty(str)) {
    return str2int[str];
  }

  idCounter += 1;
  str2int[str] = idCounter;
  int2str[idCounter] = str;
  return idCounter;
};
var integerToString = function (int) {
  if (int2str.hasOwnProperty(int)) {
    return int2str[int];
  }

  throw new Error('Out of range. No matching string for ' + int);
};

var aev2int = {};
var int2aev = {};
var agedEventToInteger = function (aev) {
  if (aev2int.hasOwnProperty(aev.name)) {
    if (aev2int[aev.name].hasOwnProperty(aev.age)) {
      return aev2int[aev.name][aev.age];
    }

    idCounter += 1;
    aev2int[aev.name][aev.age] = idCounter;
    int2aev[idCounter] = aev;
    return idCounter;
  }

  idCounter += 1;
  aev2int[aev.name] = {};
  aev2int[aev.name][aev.age] = idCounter;
  int2aev[idCounter] = aev;
  return idCounter;
};

var integerToAgedEvent = function (int) {
  if (int2aev.hasOwnProperty(int)) {
    return int2aev[int];
  }

  throw new Error('Out of range. No matching aged event for ' + int);
};


var M = function () {

  // Window, an array of array of event.
  // For example:
  //  [['a', 'b'], ['b'], ['c']]
  this.w = [];
  this.windowLength = 7;

  this.root = new Decaying();

  this.previousHeads = [];
};

M.prototype.feed = function (newEvs) {
  // Parameters:
  //   evs
  //     an array of new events
  //
  // Returns
  //   Categorical probability distribution of prediction

  newEvs = newEvs.map(stringToInteger);

  // Push evs into window head.
  this.w.unshift(newEvs);
  // Remove the oldest from the tail.
  var oldestEvs = this.w.pop();

  // Build context by mapping the window content into
  // an array of aged event objects.
  //
  var context = this.w.map(function (sliceEvs, index) {
    var timesliceIndex = index;
    return sliceEvs.map(function (ev) {
      return {
        name: ev,
        age: timesliceIndex,
      };
    });
  }).reduce(function flatten(acc, agedEvs) {
    return acc.concat(agedEvs);
  }, []);

  // Map aged events to integer representation for the tree.
  context = context.map(agedEventToInteger);

  // Map previous head and new context into edges.
  var rootEdges = context.map(function (agedEvent) {
    return {
      source: null,
      target: agedEvent,
    };
  });
  var headEdges = this.previousHeads.map(function (prevAgedEvent) {
    return context.map(function (agedEvent) {
      return {
        source: prevAgedEvent,
        target: agedEvent,
      };
    }).filter(function (edge) {
      // Allow only the direction to future.
      var sourceAge = integerToAgedEvent(edge.source).age;
      var targetAge = integerToAgedEvent(edge.target).age;
      return sourceAge >= targetAge;
    });
  }).reduce(function flatten(acc, edgeArray) {
    return acc.concat(edgeArray);
  });

  this.root.learn(rootEdges.reduce(function (acc, edge) {
    acc[edge.target] = 1;
  }, {}), rootEdges.length);  // total learned mass


};

M.prototype.inspect = function () {

};
