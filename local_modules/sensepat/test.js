// Testing

const pat = require('./index')
const test = require('tape')

const V = {
  time: 0,
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
  time: 0,
  value: [
    [1, 1, 1],
    [1, 1, 1]
  ],
  mass: [
    [1, 1, 1],
    [0, 0, 0]
  ]
}

test('len', (t) => {
  t.equal(pat.len(V), 3)
  t.end()
})

test('mean', (t) => {
  t.deepEqual(pat.mean(ONESHALF), [1, 0])
  t.deepEqual(pat.mean(V), [2/3, 1/3])
  t.end()
})

test('width', (t) => {
  t.equal(pat.width(V), 2)
  t.end()
})
