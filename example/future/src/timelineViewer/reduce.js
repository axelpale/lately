const way = require('senseway');

module.exports = (model, ev) => {
  switch (ev.type) {

    case 'EXAMPLE': {
      return Object.assign({}, model, {
        hello: 'future'
      });
    }

    default:
      return model;
  }
};
