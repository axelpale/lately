const renderWay = require('../renderWay');
const mcbsp = require('mcbsp');
const way = require('senseway');

module.exports = (model, dispatch) => {
  // Short aliases
  const hist = model.history
  const vals = model.patternValues
  const mask = model.patternMask

  const avgContext = mcbsp.pattern.averageContext(hist, vals, mask);
  const dependent = mcbsp.pattern.dependent(hist, vals, mask);

  const container = document.createElement('div');

  container.appendChild(renderWay(vals, {
    label: 'pattern values',
    numbers: false,
    setCell: (c, t, value) => dispatch({
      type: 'SET_PATTERN_VALUE',
      channel: c,
      time: t,
      value: value
    }),
    deleteFrame: (t) => dispatch({
      type: 'DELETE_PATTERN_FRAME',
      time: t
    }),
    duplicateFrame: (t) => dispatch({
      type: 'DUPLICATE_PATTERN_FRAME',
      time: t
    })
  }));

  container.appendChild(renderWay(mask, {
    label: 'pattern mask',
    numbers: false,
    setCell: (c, t, value) => dispatch({
      type: 'SET_PATTERN_MASK_VALUE',
      channel: c,
      time: t,
      value: value
    }),
    deleteFrame: (t) => dispatch({
      type: 'DELETE_PATTERN_FRAME',
      time: t
    }),
    duplicateFrame: (t) => dispatch({
      type: 'DUPLICATE_PATTERN_FRAME',
      time: t
    })
  }));

  container.appendChild(renderWay(avgContext, {
    label: 'avg context'
  }));
  container.appendChild(renderWay(dependent, 'bits of information gained'));
  return container;
};
