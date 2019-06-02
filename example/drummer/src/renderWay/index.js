const senseway = require('senseway');
const renderFrameElem = require('./renderFrameElem');
const renderCellRowElem = require('./renderCellRowElem');
const renderCellElem = require('./renderCellElem');
const renderFrameButton = require('./renderFrameButton');

const renderDuplicateChannelControls = require('./renderDuplicateChannelControls');
const renderDeleteChannelControls = require('./renderDeleteChannelControls');


module.exports = (way, opts) => {
  // Params:
  //   way
  //   opts
  //     class: string
  //     deleteChannel: fn(channel)
  //     deleteFrame: fn(time)
  //     duplicateChannel: fn(channel)
  //     duplicateFrame: fn(time)
  //     label: string
  //     mask: a way with same size as the given way
  //     numbers: bool
  //     numbersBegin: int
  //     setCell: fn(channel, time, value)
  //
  const container = document.createElement('div');
  container.classList.add('way');

  if (typeof opts !== 'object') {
    if (typeof opts === 'string') {
      opts = {
        label: opts
      };
    } else {
      opts = {};
    }
  }

  if (typeof opts.numbersBegin !== 'number') {
    opts.numbersBegin = 0;
  }

  if (typeof opts.class === 'string') {
    const classes = opts.class.split(' ');
    classes.forEach(className => {
      container.classList.add(className);
    });
  }

  // Channel controls

  if (typeof opts.duplicateChannel === 'function') {
    container.appendChild(renderDuplicateChannelControls(way, opts.duplicateChannel));
  }

  if (typeof opts.deleteChannel === 'function') {
    container.appendChild(renderDeleteChannelControls(way, opts.deleteChannel));
  }

  // Frames

  for (let t = 0; t < way[0].length; t += 1) {

    // Label for the frame row
    let lab = '';
    if (t === 0 && typeof opts.label === 'string') {
      lab = opts.label;
    } else if (opts.numbers) {
      const rownum = opts.numbersBegin + t;
      if (rownum % 2 === 0) {
        lab = '' + rownum;
      }
    }

    const fr = renderFrameElem(lab);
    const cr = renderCellRowElem(t);
    const maxValue = senseway.max(way); // For normalisation to color scale.

    for (let c = 0; c < way.length; c += 1) {
      // Normalise value for gray scale.
      const val = (maxValue === 0) ? 0 : way[c][t] / maxValue;
      const label = '' + way[c][t];
      const cel = renderCellElem(c, t, val, label);

      if (typeof opts.mask === 'object') {
        cel.style.opacity = '' + Math.max(0.1, opts.mask[c][t])
      }

      if (typeof opts.setCell === 'function') {
        cel.addEventListener('click', () => {
          opts.setCell(c, t, val ? 0 : 1);
        });
      }
      cr.appendChild(cel);
    }

    fr.appendChild(cr);

    if (typeof opts.deleteFrame === 'function') {
      fr.appendChild(renderFrameButton('&ndash;', () => {
        opts.deleteFrame(t);
      }));
    }

    if (typeof opts.duplicateFrame === 'function') {
      fr.appendChild(renderFrameButton('+', () => {
        opts.duplicateFrame(t);
      }));
    }

    container.appendChild(fr);
  }

  return container;
};
