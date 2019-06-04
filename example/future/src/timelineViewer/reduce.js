const way = require('senseway');

module.exports = (model, ev) => {
  switch (ev.type) {

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
