// Testing

const way = require('./index')
const test = require('tape')

const W0 = [
  [1, 0, 1],
  [0, 1, 1]
]
const W1 = [
  [0, 0, 1],
  [1, 0, 0]
]
const ONES = [
  [1, 1, 1],
  [1, 1, 1]
]
const ZEROS = [
  [0, 0, 0],
  [0, 0, 0]
]

test('add', (t) => {
  t.deepEqual(way.add(W0, W1), [
    [1, 0, 2],
    [1, 1, 1]
  ])
  t.end()
})

test('after', (t) => {
  t.deepEqual(way.after(ONES, 2), [
    [1],
    [1]
  ])
  t.end()
})

test('before', (t) => {
  t.deepEqual(way.before(W1, 2), [
    [0, 0],
    [1, 0]
  ])
  t.end()
})

test('channel', (t) => {
  t.deepEqual(way.channel(W0, 1), [
    [0, 1, 1]
  ])
  t.end()
})

test('channels', (t) => {
  t.deepEqual(way.channels(W0, [0, 1]), [
    [1, 0, 1],
    [0, 1, 1]
  ])
  t.end()
})

test('create', (t) => {
  t.deepEqual(way.create(2, 3, 1), ONES)
  t.end()
})

test('equal', (t) => {
  t.true(way.equal(W0, W0))
  t.false(way.equal(W0, W1))
  t.end()
})

test('first', (t) => {
  t.deepEqual(way.first(W0, 2), [
    [1, 0],
    [0, 1]
  ])
  t.end()
})

test('frame', (t) => {
  t.deepEqual(way.frame(W0, 1), [
    [0],
    [1]
  ])
  t.end()
})

test('increase', (t) => {
  t.deepEqual(way.increase(ONES, 1), [
    [2, 2, 2],
    [2, 2, 2]
  ])
  t.end()
})

test('join', (t) => {
  t.deepEqual(way.join(ZEROS, ONES), [
    [0, 0, 0, 1, 1, 1],
    [0, 0, 0, 1, 1, 1]
  ])
  t.end()
})

test('last', (t) => {
  t.deepEqual(way.last(W0, 2), [
    [0, 1],
    [1, 1]
  ])
  t.end()
})

test('len', (t) => {
  t.equal(way.len(W0), 3)
  t.end()
})

test('map', (t) => {
  t.deepEqual(way.map(ONES, q => q * 2), [
    [2, 2, 2],
    [2, 2, 2]
  ])
  t.deepEqual(way.map(ONES, (q, c, t) => t * (c + 1)), [
    [0, 1, 2],
    [0, 2, 4]
  ])
  t.end()
})

test('mix', (t) => {
  t.deepEqual(way.mix(ZEROS, ONES), [
    [0, 0, 0],
    [0, 0, 0],
    [1, 1, 1],
    [1, 1, 1]
  ])
  t.end()
})

test('multiply', (t) => {
  t.deepEqual(way.multiply(ONES, ZEROS), ZEROS)
  t.end()
})

test('reduce', (t) => {
  t.equal(way.reduce(ONES, (acc, q) => acc + q, 0), 6)
  t.end()
})

test('scale', (t) => {
  t.deepEqual(way.scale(ONES, 2), [
    [2, 2, 2],
    [2, 2, 2]
  ])
  t.end()
})

test('slice', (t) => {
  t.deepEqual(way.slice(W0, 1, 3), [
    [0, 1],
    [1, 1]
  ])
  t.end()
})
