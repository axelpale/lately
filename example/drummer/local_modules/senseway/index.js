// Senseway, a multi-channel timeline.
//

exports.add = (wayA, wayB) => {
  return wayA.map((ch, c) => ch.map((q, t) => q + wayB[c][t]))
}

exports.after = (way, t, len) => {
  if (typeof len === 'undefined') { len = way[0].length - t }
  len = Math.min(len, way[0].length - t)
  return way.map(ch => ch.slice(t, t + len))
}

exports.before = (way, t, len) => {
  if (typeof len === 'undefined') { len = t }
  len = Math.min(len, t)
  return way.map(ch => ch.slice(t - len, t))
}

exports.channel = (way, c) => {
  // Pick one channel for a way.
  return [way[c]]
}

exports.channels = (way, cs) => {
  // Pick multiple channels
  return cs.map(c => way[c])
}

exports.clone = (way) => {
  return way.map((ch) => {
    return ch.slice()
  })
}

exports.create = (width, len, fill) => {
  if (typeof fill !== 'number') {
    throw new Error('Fill must be number')
  }

  const channels = [];
  let i, j, ch;
  for (i = 0; i < width; i += 1) {
    ch = [];
    for (j = 0; j < len; j += 1) {
      ch.push(fill)
    }
    channels.push(ch)
  }
  return channels
};

exports.dropAt = (way, t) => {
  // Remove frame at t
  const w = exports.clone(way)
  w.map((ch) => {
    return ch.splice(t, 1)
  })
  return w
}

exports.dropChannel = (way, channel) => {
  return way.filter((ch, c) => c !== channel)
}

exports.equal = (wayA, wayB) => {
  let i, j, ch
  for (i = 0; i < wayA.length; i += 1) {
    for (j = 0; j < wayA[0].length; j += 1) {
      if (wayA[i][j] !== wayB[i][j]) {
        return false
      }
    }
  }
  return true
}

exports.fill = (way, filler) => {
  // Same size, quanta replaced with filler.
  return way.map(ch => ch.map(q => filler))
}

exports.first = (way, n) => {
  // First n frames; the oldest
  return way.map(ch => ch.slice(0, n))
}

exports.frame = (way, t) => {
  return way.map(ch => [ch[t]]) // frame is an array of arrays
}

exports.increase = (way, addition) => {
  return way.map(ch => ch.map(quantum => quantum + addition))
}

exports.join = (wayA, wayB) => {
  if (wayA.length !== wayB.length) {
    throw new Error('Number of channels must match.')
  }
  return wayA.map((ch, c) => [].concat(ch, wayB[c]))
}

exports.last = (way, n) => {
  // Last n frames; the most recent
  return way.map(ch => ch.slice(ch.length - n, ch.length))
}

exports.len = (way) => {
  return way[0].length
}

exports.map = (way, fn) => {
  return way.map((ch, c) => ch.map((q, t) => fn(q, c, t)))
}

exports.map2 = (wayA, wayB, fn) => {
  return wayA.map((ch, c) => ch.map((q, t) => fn(q, wayB[c][t], c, t)))
}

exports.mean = (way) => {
  // Returns a frame.
  return way.map((ch) => {
    return [ch.reduce((acc, q) => acc + q, 0) / ch.length]
  })
}

exports.mix = (wayA, wayB) => {
  if (wayA[0].length !== wayB[0].length) {
    throw new Error('Length of channels must match.')
  }
  return [].concat(wayA, wayB)
}

exports.multiply = (wayA, wayB) => {
  return wayA.map((ch, c) => ch.map((q, t) => q * wayB[c][t]))
}

exports.padLeft = (way, len, filler) => {
  if (way[0].length >= len) {
    return way
  }
  const head = exports.create(way.length, len - way[0].length, filler)
  return exports.join(head, way)
}

exports.padRight = (way, len, filler) => {
  if (way[0].length >= len) {
    return way
  }
  const tail = exports.create(way.length, len - way[0].length, filler)
  return exports.join(way, tail)
}

exports.reduce = (way, iteratee, acc) => {
  return way.reduce((ac, ch, c) => {
    return ch.reduce((a, q, t) => {
      return iteratee(a, q, c, t)
    }, ac)
  }, acc)
}

exports.repeatAt = (way, t) => {
  // Repeat frame at
  const w = exports.clone(way)
  w.map(ch => {
    const val = ch[t]
    return ch.splice(t, 0, val)
  })
  return w
}

exports.repeatChannel = (way, c) => {
  const w = way.slice()
  w.splice(c, 0, way[c])
  return w
}

exports.scale = (way, multiplier) => {
  return way.map(ch => ch.map(quantum => quantum * multiplier))
}

exports.set = (way, c, t, value) => {
  // Set value of a cell
  const w = exports.clone(way)
  w[c][t] = value
  return w
}

exports.slice = (way, begin, end) => {
  return way.map(ch => ch.slice(begin, end))
}

exports.sum = (way) => {
  return way.reduce((acc, ch) => ch.reduce((ac, q) => ac + q, acc), 0)
}

exports.width = (way) => {
  return way.length
}
