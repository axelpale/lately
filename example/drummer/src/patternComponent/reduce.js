const way = require('senseway');

module.exports = (model, ev) => {
  if (!model.patternValues) {
    const width = model.history.length
    let vals = way.create(width, width, 0)
    vals[0][0] = 1
    return Object.assign({}, model, {
      patternValues: vals,
      patternMask: vals
    })
  }

  switch (ev.type) {

    case 'DELETE_PATTERN_FRAME': {
      return Object.assign({}, model, {
        patternValues: way.dropAt(model.patternValues, ev.time),
        patternMask: way.dropAt(model.patternMask, ev.time)
      });
    }

    case 'DUPLICATE_PATTERN_FRAME': {
      return Object.assign({}, model, {
        patternValues: way.repeatAt(model.patternValues, ev.time),
        patternMask: way.repeatAt(model.patternMask, ev.time)
      });
    }

    case 'SET_PATTERN_VALUE': {
      return Object.assign({}, model, {
        patternValues: way.set(model.patternValues, ev.channel, ev.time, ev.value)
      });
    }

    case 'SET_PATTERN_MASK_VALUE': {
      return Object.assign({}, model, {
        patternMask: way.set(model.patternMask, ev.channel, ev.time, ev.value)
      });
    }

    default:
      return model;
  }
};
