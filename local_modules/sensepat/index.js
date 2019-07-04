//
// A pattern:
// {
//   time: the beginning of pattern in time
//   value: a matrix of values
//   mass: a matrix of how meaninful each value is
// }

exports.contextMean = require('./lib/contextMean')

exports.equalSize = require('./lib/equalSize')

exports.findMatches = require('./lib/findMatches')

exports.infoGain = require('./lib/infoGain')

exports.len = require('./lib/len')

exports.massMatches = require('./lib/massMatches')

exports.match = require('./lib/match')

exports.mean = require('./lib/mean')

exports.mixedToPattern = require('./lib/mixedToPattern')

exports.pattern = (value, mass) => {
  return {
    value: value,
    mass: mass
  }
}

exports.single = require('./lib/single')

exports.slice = require('./lib/slice')

exports.sliceAround = require('./lib/sliceAround')

exports.sum = require('./lib/sum')

exports.toArray = require('./lib/toArray')

exports.width = require('./lib/width')
