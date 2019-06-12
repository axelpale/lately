//
// A pattern:
// {
//   time: the beginning of pattern in time
//   value: a matrix of values
//   mass: a matrix of how meaninful each value is
// }

exports.contextMean = require('./lib/contextMean')

exports.equalSize = require('./lib/equalSize')

exports.infoGain = require('./lib/infoGain')

exports.len = require('./lib/len')

exports.mean = require('./lib/mean')

exports.mixedToPattern = require('./lib/mixedToPattern')

exports.pattern = (value, mass) => {
  return {
    value: value,
    mass: mass
  }
}

exports.single = require('./lib/single')

exports.sum = require('./lib/sum')

exports.width = require('./lib/width')
