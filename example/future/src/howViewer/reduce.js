const way = require('senseway');

module.exports = (model, ev) => {
  if (model.how.selected === null) {
    model = Object.assign({}, model, {
      how: Object.assign({}, model.how, {
        selected: way.set(way.fill(model.timeline, 0), 0, 0, 1) // pick first
      })
    })
  }

  switch (ev.type) {

    case 'HOW_EDIT_SELECTED': {
      const c = ev.channel
      const t = ev.time

      const zero = way.fill(model.timeline, 0)
      const pickOne = way.set(zero, c, t, 1)

      return Object.assign({}, model, {
        how: Object.assign({}, model.how, {
          selected: pickOne
        })
      })
    }

    default:
      return model
  }
};
