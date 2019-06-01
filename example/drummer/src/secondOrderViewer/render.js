const renderWay = require('../renderWay');
const mcbsp = require('mcbsp');
const way = require('senseway');

module.exports = (model, dispatch) => {
  const patternLen = model.contextDistance
  const secondOrder = mcbsp.pattern.secondOrderPatterns(model.history, patternLen)
  const container = document.createElement('div');

  {
    const h2 = document.createElement('h2');
    h2.innerHTML = 'Second-Order Patterns';
    container.appendChild(h2);
  }

  secondOrder.map(p => {
    const row = document.createElement('div');

    row.appendChild(renderWay(p.pattern.values, {
      label: 'pattern',
      class: 'pattern',
      mask: p.pattern.mask
    }));
    // row.appendChild(renderWay(patt.values, {
    //   label: 'masked<br>prob',
    //   class: 'pattern',
    //   mask: patt.mask
    // }));
    row.appendChild(renderWay(p.average, {
      label: 'prob',
      class: 'pattern'
    }));
    row.appendChild(renderWay(p.gain, {
      label: 'gain',
      class: 'pattern pattern-mask'
    }));

    container.appendChild(row);
  });

  return container;
};
