const lately = require('./index')
const test = require('tape')

test('predict', (t) => {
  const history = [
    [1, 0, 1],
    [0, 0, 0]
  ]
  t.deepEqual(lately.predict(history, 2), [
    [0, 1],
    [0, 0]
  ])
  t.end()
})
