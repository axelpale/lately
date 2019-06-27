const patwidth = require('./width')
const patlen = require('./len')

module.exports = (pat) => {
  // Mean of each channel.
  // Return an array.
  // TODO should also return mass?

  const width = patwidth(pat)
  const len = patlen(pat)
  const result = {
    value: [[]],
    mass: [[]]
  }

  for (let c = 0; c < width; c += 1) {
    let valuesum = 0
    let masssum = 0

    for (let t = 0; t < len; t += 1) {
      valuesum += pat.mass[c][t] * pat.value[c][t]
      masssum += pat.mass[c][t]
    }

    if (masssum === 0) {
      result.value[0].push(0)
    } else {
      result.value[0].push(valuesum / masssum)
    }
    result.mass[0].push(masssum)
  }

  return result
}
