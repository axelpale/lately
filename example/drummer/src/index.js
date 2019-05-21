// Visual concepts
// - timeline: a sequence and all channels
// - sequence: the state of the timeline
// - channel: a dimension of each time frame
// - frame: a state of each channel at a given time
// - cell: a state of a channel at a given time
const datasets = require('./datasets');
const clearElem = require('./clearElem');
const createDatasetControl = require('./createDatasetControl');
const createPredictionControls = require('./createPredictionControls');
const createChannelControls = require('./createChannelControls');

const createHistoryElem = require('./createHistoryElem');
const createPredictedFutureElem = require('./createPredictedFutureElem');
const createAPrioriElem = require('./createAPrioriElem');
const predict = require('./predict');

const reduceSetValue = require('./reduceSetValue');
const reduceSetContextDistance = require('./reduceSetContextDistance');
const reduceDuplicateFrame = require('./reduceDuplicateFrame');
const reduceRemoveFrame = require('./reduceRemoveFrame');
const reduceDuplicateChannel = require('./reduceDuplicateChannel');
const reduceSetPredictionDistance = require('./reduceSetPredictionDistance');

const reduceRemoveChannel = require('./reduceRemoveChannel');
const reduceSelectDataset = require('./reduceSelectDataset');

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
    model = reduceSetValue(model, ev);
    model = reduceSetContextDistance(model, ev);
    model = reduceDuplicateFrame(model, ev);
    model = reduceRemoveFrame(model, ev);
    model = reduceDuplicateChannel(model, ev);
    model = reduceRemoveFrame(model, ev);
    model = reduceSetPredictionDistance(model, ev);
    model = reduceRemoveChannel(model, ev);
    model = reduceSelectDataset(model, ev);

    return model;
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

    const elems = [
      createDatasetControl(model, dispatch),
      createPredictionControls(model, dispatch),
      createChannelControls(model, dispatch),
      createHistoryElem(model, dispatch),
      createPredictedFutureElem(model, dispatch),
      createAPrioriElem(model, dispatch)
    ];

    elems.forEach(elem => {
      container.appendChild(elem);
    });
  };

  const store = (model) => {
    const modelJson = JSON.stringify(model);
    window.localStorage.setItem('model', modelJson);
  };

  // Init
  render(initialModel);
};
