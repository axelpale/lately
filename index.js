const mcbsp = require('mcbsp')

exports.predict = (history, distance) => {
  const context = way.last(history, distance)
  const predicted = mcbsp.pattern.firstOrderPredict(history, context, distance)
  const future = way.last(predicted, distance)
  return future
}
