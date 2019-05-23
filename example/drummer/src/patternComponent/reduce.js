const way = require('senseway');

module.exports = (model, ev) => {
  const values = model.patternValues
  const mask = model.patternMask

  if (!values || model.history.length !== values.length) {
    const width = model.history.length
    let vals = way.create(width, width, 0)
    vals[0][0] = 1
    model = Object.assign({}, model, {
      patternValues: vals,
      patternMask: vals
    })
  }

  switch (ev.type) {

    case 'DELETE_PATTERN_FRAME': {
      return Object.assign({}, model, {
        patternValues: way.dropAt(values, ev.time),
        patternMask: way.dropAt(mask, ev.time)
      });
    }

    case 'DUPLICATE_PATTERN_FRAME': {
      return Object.assign({}, model, {
        patternValues: way.repeatAt(values, ev.time),
        patternMask: way.repeatAt(mask, ev.time)
      });
    }

    case 'SET_PATTERN_VALUE': {
      return Object.assign({}, model, {
        patternValues: way.set(values, ev.channel, ev.time, ev.value)
      });
    }

    case 'SET_PATTERN_MASK_VALUE': {
      return Object.assign({}, model, {
        patternMask: way.set(mask, ev.channel, ev.time, ev.value)
      });
    }

    default:
      return model;
  }
};
