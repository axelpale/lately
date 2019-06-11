const way = require('senseway');

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'HOW_EDIT_SELECTED': {
      const c = ev.channel
      const t = ev.time
      const isAvailable = model.timeline[c][t] === null

      let selected = way.fill(model.timeline, 0)
      if (isAvailable) {
        selected = way.set(selected, c, t, 1)
      }

      return Object.assign({}, model, {
        how: Object.assign({}, model.how, {
          selected: selected
        })
      })
    }

    default:
      return model
  }
};
