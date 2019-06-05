//
// A pattern:
// {
//   time: the beginning of pattern in time
//   value: a matrix of values
//   mass: a matrix of how meaninful each value is
// }

exports.contextMean = require('./lib/contextMean')

exports.equalSize = require('./lib/equalSize')

exports.len = (pat) => {
  return pat.value[0].length
}

exports.mean = (pat) => {
  // Mean of each channel.
  // Return an array.
  // TODO should also return mass?

  const width = exports.width(pat)
  const len = exports.len(pat)
  const result = []

  for (let c = 0; c < width; c += 1) {
    let valuesum = 0
    let masssum = 0

    for (let t = 0; t < len; t += 1) {
      valuesum += pat.mass[c][t] * pat.value[c][t]
      masssum += pat.mass[c][t]
    }

    if (masssum === 0) {
      result.push(0)
    } else {
      result.push(valuesum / masssum)
    }
  }

  return result
}

exports.pattern = (value, mass) => {
  return {
    value: value,
    mass: mass
  }
}

exports.width = (pat) => {
  return pat.value.length
}
