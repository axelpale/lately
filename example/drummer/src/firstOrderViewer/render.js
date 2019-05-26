const renderWay = require('../renderWay');
const mcbsp = require('mcbsp');
const way = require('senseway');

module.exports = (model, dispatch) => {
  const patternLen = model.contextDistance + model.predictionDistance
  const firstOrder = mcbsp.pattern.firstOrderPatterns(model.history, patternLen)
  const container = document.createElement('div');

  {
    const h2 = document.createElement('h2');
    h2.innerHTML = 'First-Order Patterns';
    container.appendChild(h2);
  }

  way.map(firstOrder, (patt, c, t) => {
    container.appendChild(renderWay(patt.values, {
      label: '[' + c + '][' + t + '] prob',
      class: 'pattern'
    }));
    container.appendChild(renderWay(patt.mask, {
      label: '[' + c + '][' + t + '] gain',
      class: 'pattern pattern-mask'
    }));
  });

  return container;
};
