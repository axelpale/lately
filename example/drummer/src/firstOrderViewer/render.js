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
    const row = document.createElement('div');

    row.appendChild(renderWay(patt.source.values, {
      label: 'channel ' + c + '<br>value ' + t,
      class: 'pattern',
      mask: patt.source.mask
    }));
    row.appendChild(renderWay(patt.values, {
      label: 'masked<br>prob',
      class: 'pattern',
      mask: patt.mask
    }));
    row.appendChild(renderWay(patt.values, {
      label: 'prob',
      class: 'pattern'
    }));
    row.appendChild(renderWay(patt.mask, {
      label: 'gain',
      class: 'pattern pattern-mask'
    }));

    container.appendChild(row);
  });

  return container;
};
