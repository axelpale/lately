const way = require('senseway');

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'IMPORT_MODEL': {
      return Object.assign({}, model, {
        channels: ev.model.channels,
        frames: ev.model.frames,
        timeline: ev.model.timeline
      });
    }

    default:
      return model;
  }
};
