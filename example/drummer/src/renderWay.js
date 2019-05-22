const createFrameElem = require('./createFrameElem');
const createCellRowElem = require('./createCellRowElem');
const createCellElem = require('./createCellElem');

module.exports = (way, label) => {
  const container = document.createElement('div');
  container.classList.add('way');

  for (let t = 0; t < way[0].length; t += 1) {
    let lab = (t > 0 || typeof label === 'undefined') ? t : label;
    let fr = createFrameElem(lab);
    let cr = createCellRowElem(t);

    for (let c = 0; c < way.length; c += 1) {
      let val = way[c][t];
      let cel = createCellElem(t, c, val, way.length);
      cr.appendChild(cel);
    }
    fr.appendChild(cr);

    container.appendChild(fr);
  }

  return container;
};
