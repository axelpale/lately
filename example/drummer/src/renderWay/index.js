const renderFrameElem = require('./renderFrameElem');
const renderCellRowElem = require('./renderCellRowElem');
const renderCellElem = require('./renderCellElem');

const renderDuplicateChannelControls = require('./renderDuplicateChannelControls');
const renderDeleteChannelControls = require('./renderDeleteChannelControls');


module.exports = (way, opts) => {
  // Params:
  //   way
  //   opts
  //     class: string
  //     click: fn(channel, time)
  //     deleteChannel: fn(channel)
  //     deleteFrame: fn(time)
  //     duplicateChannel: fn(channel)
  //     duplicateFrame: fn(time)
  //     label: string
  //     numbers: bool
  //     numbersBegin: int
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
    container.classList.add(opts.class);
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

    for (let c = 0; c < way.length; c += 1) {
      const val = way[c][t];
      const cel = renderCellElem(t, c, val, way.length);

      if (typeof opts.click === 'function') {
        cel.addEventListener('click', () => {
          opts.click(c, t, val);
        });
      }
      cr.appendChild(cel);
    }
    fr.appendChild(cr);

    if (typeof opts.deleteFrame === 'function') {
      const btn = document.createElement('button');
      btn.innerHTML = '&ndash;';
      btn.addEventListener('click', () => {
        opts.deleteFrame(t);
      });
      fr.appendChild(btn);
    }

    if (typeof opts.duplicateFrame === 'function') {
      const btn = document.createElement('button');
      btn.innerHTML = '+';
      btn.addEventListener('click', () => {
        opts.duplicateFrame(t);
      });
      fr.appendChild(btn);
    }

    container.appendChild(fr);
  }

  return container;
};
