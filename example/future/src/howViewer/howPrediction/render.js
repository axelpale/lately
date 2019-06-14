const way = require('senseway')
const pat = require('sensepat')
const wayElem = require('../../lib/wayElem')
const predict = require('../../lib/predict')

module.exports = (model, dispatch) => {
  const root = document.createElement('div')

  const c = model.how.select.channel
  const t = model.how.select.time
  const pred = predict(model, c, t)
  const predWay = way.set(model.timeline, c, t, pred.prob)

  root.appendChild(wayElem(pred.context.value, {
    reversed: true,
    heading: 'Pred Context Value',
    caption: ''
  }))

  root.appendChild(wayElem(pred.context.mass, {
    reversed: true,
    heading: 'Pred Context Mass',
    caption: ''
  }))

  root.appendChild(wayElem(pred.contextMean.value, {
    reversed: true,
    heading: 'Pred Context Mean Value',
    caption: ''
  }))

  root.appendChild(wayElem(pred.contextMean.mass, {
    reversed: true,
    heading: 'Pred Context Mean Mass',
    caption: ''
  }))

  root.appendChild(wayElem(pred.probField, {
    reversed: true,
    heading: 'Pred Prob Field',
    caption: ''
  }))

  root.appendChild(wayElem(predWay, {
    reversed: true,
    heading: 'Prediction',
    caption: 'Context mean shows the probability of cell being 1 given '
      + 'the selected event becoming 1. With Bayes\' rule we compute '
      + 'the probability of the selected event given the context.'
  }))

  return root
}
