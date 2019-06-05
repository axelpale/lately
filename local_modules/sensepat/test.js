// Testing

const pat = require('./index')
const test = require('tape')

const V = {
  value: [
    [1, 0, 1],
    [0, 1, 0]
  ],
  mass: [
    [1, 1, 1],
    [1, 1, 1]
  ]
}

const ONESHALF = {
  value: [
    [1, 1, 1],
    [1, 1, 1]
  ],
  mass: [
    [1, 1, 1],
    [0, 0, 0]
  ]
}

test('contextMean', (t) => {
  // Trivial
  const hist = {
    value: [[1]],
    mass: [[1]]
  }
  const patt = {
    value: [[1]],
    mass: [[1]]
  }
  const ctx = pat.contextMean(hist, patt)
  t.deepEqual(ctx, {
    value: [[1]],
    mass: [[1]]
  })

  // Simple. Two matches.
  const h2 = {
    value: [[1, 1, 0]],
    mass: [[1, 1, 1]]
  }
  const p2 = {
    value: [[1, 0]],
    mass: [[1, 0]]
  }
  const ctx2 = pat.contextMean(h2, p2)
  t.deepEqual(ctx2, {
    value: [[1, 0.5]],
    mass: [[2, 2]]
  })

  // Three matches, last on the edge.
  const h3 = {
    value: [[1, 1, 0, 1]],
    mass: [[1, 1, 1, 1]]
  }
  const p3 = {
    value: [[1, 0]],
    mass: [[1, 0]]
  }
  const ctx3 = pat.contextMean(h3, p3)
  t.deepEqual(ctx3, {
    value: [[1, 0.5]],
    mass: [[3, 2]]
  })

  t.end()
})

test('equalSize', (t) => {
  t.equal(pat.equalSize(V, ONESHALF), true)

  const VS = {
    value: [[1, 0], [0, 1]],
    mass: [[1, 1], [1, 1]]
  }
  t.equal(pat.equalSize(V, VS), false)
  t.end()
})

test('infoGain', (t) => {
  const prior = {
    value: [[0.5]],
    mass: [[1]]
  }
  const posterior = {
    value: [[1]],
    mass: [[1]]
  }
  const gain = {
    value: [[1]],
    mass: [[1]]
  }
  t.deepEqual(pat.infoGain(prior, posterior), gain)
  t.end()
})

test('len', (t) => {
  t.equal(pat.len(V), 3)
  t.end()
})

test('mean', (t) => {
  t.deepEqual(pat.mean(ONESHALF), [1, 0])
  t.deepEqual(pat.mean(V), [2 / 3, 1 / 3])
  t.end()
})

test('sum', (t) => {
  const a = {
    value: [[0, 1, 1], [1, 1, 0]],
    mass: [[1, 1, 0], [1, 1, 0]]
  }
  t.equal(pat.sum(a), 3)
  t.end()
})

test('width', (t) => {
  t.equal(pat.width(V), 2)
  t.end()
})
