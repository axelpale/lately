const clearElem = require('./lib/clearElem');
const way = require('senseway');

const elements = [
  require('./timelineViewer/render')
];

const reducers = [
  require('./timelineViewer/reduce')
];

module.exports = (opts) => {

  const defaultModel = opts.defaultModel;

  // Persistence
  let initialModel;
  const storedModel = window.localStorage.getItem('model');
  if (storedModel) {
    initialModel = JSON.parse(storedModel);
  } else {
    initialModel = defaultModel;
  }

  const reducer = (model, ev) => {
    return reducers.reduce((acc, re) => re(acc, ev), model);
  };

  let currentModel = initialModel;

  const dispatch = (ev) => {
    const newModel = reducer(currentModel, ev);
    render(newModel);
    store(newModel);
    currentModel = newModel;
  };

  const render = (model) => {
    const container = document.getElementById('content');
    clearElem(container);

    elements.forEach(createElemFn => {
      container.appendChild(createElemFn(model, dispatch));
    });
  };

  const store = (model) => {
    const modelJson = JSON.stringify(model);
    window.localStorage.setItem('model', modelJson);
  };

  // This allows reducers to fill in missing properties.
  // Also triggers the first render.
  dispatch({
    type: '__INIT__'
  });
};
