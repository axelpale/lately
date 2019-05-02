// A minimal and more functional alternative to Categorical.
// Stored here for future API reference.
// Copied from axelpale/talker

module.exports = function (initDist) {
  if (typeof initDist === 'undefined') { initDist = {} }

  var self = {
    dist: initDist
  }

  self.cloneDist = () => {
    var newDist = {}
    self.each((id, weight) => {
      newDist[id] = weight
    })
    return newDist
  }

  self.clone = () => {
    return module.exports(self.cloneDist())
  }

  self.each = (fn) => {
    // fn(id, weight)
    //
    Object.keys(self.dist).forEach((id) => {
      fn(id, self.dist[id])
    })
  }

  self.mapWeights = (fn) => {
    // fn(id, weight) => weight
    Object.keys(self.dist).forEach((id) => {
      self.dist[id] = fn(id, self.dist[id])
    })
  }

  self.map = (fn) => {
    var newDist = {}
    self.each((id, weight) => {
      newDist[id] = fn(id, weight)
    })
    return module.exports(newDist)
  }

  self.multiply = (multiplier) => {
    // Used to forget: multiply(0.88)
    self.mapWeights((id, weight) => {
      return weight * multiplier
    })
  }

  self.sum = () => {
    // OPTIMIZE
    var sum = 0
    for (var id in self.dist) {
      if (self.dist.hasOwnProperty(id)) {
        sum += self.dist[id]
      }
    }
    return sum
  }

  self.learn = (ids) => {
    var newDist = self.cloneDist()

    if (typeof ids.length !== 'number') {
      // dict, not array, not safe
      Object.keys(ids).forEach((id) => {
        if (!newDist.hasOwnProperty(id)) {
          newDist[id] = 0
        }
        newDist[id] += ids[id]
      })
    } else {
      // array
      ids.forEach((id) => {
        if (!newDist.hasOwnProperty(id)) {
          newDist[id] = 0
        }
        newDist[id] += 1
      })
    }

    return module.exports(newDist)
  }

  self.prob = (id) => {
    if (self.dist.hasOwnProperty) {
      return self.dist[id] / self.sum()
    }
    return 0
  }

  self.sampleOne = () => {
    var r = Math.random()
    var sum = self.sum()
    var target = sum * r
    var w = 0
    var id
    for (id in self.dist) {
      if (self.dist.hasOwnProperty(id)) {
        w += self.dist[id]
        if (target < w) {
          return id
        }
      }
    }
  }

  return self
}
