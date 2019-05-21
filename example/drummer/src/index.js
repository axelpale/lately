// Visual concepts
// - timeline: a sequence and all channels
// - sequence: the state of the timeline
// - channel: a dimension of each time frame
// - frame: a state of each channel at a given time
// - cell: a state of a channel at a given time
const datasets = require('./datasets');
const clearElem = require('./clearElem');
const predict = require('./predict');

const elements = [
  require('./createDatasetControl'),
  require('./createPredictionControls'),
  require('./createChannelControls'),
  require('./createHistoryElem'),
  require('./createPredictedFutureElem'),
  require('./createAPrioriElem')
];

const reducers = [
  require('./reduceSetValue'),
  require('./reduceSetContextDistance'),
  require('./reduceDuplicateFrame'),
  require('./reduceRemoveFrame'),
  require('./reduceDuplicateChannel'),
  require('./reduceRemoveFrame'),
  require('./reduceSetPredictionDistance'),
  require('./reduceRemoveChannel'),
  require('./reduceSelectDataset')
];

{
  const defaultModel = {
    historyKey: 'FLOWER',
    history: datasets.FLOWER,
    contextDistance: 8,
    predictionDistance: 8,
  };

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
    const container = document.getElementById('timeline');
    clearElem(container);

    elements.forEach(createElemFn => {
      container.appendChild(createElemFn(model, dispatch));
    });
  };

  const store = (model) => {
    const modelJson = JSON.stringify(model);
    window.localStorage.setItem('model', modelJson);
  };

  // Init
  render(initialModel);
};
