const way = require('senseway');

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'EDIT_CELL': {
      const curval = model.timeline[ev.channel][ev.time];
      const nextval = (() => {
        if (curval === null) return 1
        if (curval === 1) return 0
        if (curval === 0) return null
      })();

      return Object.assign({}, model, {
        timeline: way.set(model.timeline, ev.channel, ev.time, nextval)
      });
    }

    case 'OPEN_FRAME_TITLE_EDITOR': {
      return Object.assign({}, model, {
        frameOnEdit: ev.time
      });
    }

    case 'EDIT_FRAME_TITLE': {
      return Object.assign({}, model, {
        frameOnEdit: null,
        frames: model.frames.map((frameConf, t) => {
          if (t === ev.time) {
            return Object.assign({}, frameConf, {
              title: ev.title
            });
          } // else
          return frameConf;
        })
      });
    }

    default:
      return model;
  }
};
