// Visual concepts
// - timeline: the sequence and all channels
// - sequence: the state of the cells in the timeline
// - channel: a dimension of each time frame
// - frame: a state of each channel at a given time
// - cell: a state of a channel at a given time
const mcbsp = require('mcbsp');
const way = require('senseway');
const datasets = require('./datasets')

const clearElem = (el) => {
  while(el.firstChild){
    el.removeChild(el.firstChild);
  }
  return el;
};

const createDatasetControl = (model, dispatch) => {
  const control = document.createElement('div');
  control.classList.add('dataset');
  const input = document.createElement('select');

  Object.keys(datasets).forEach(key => {
    const opt = document.createElement('option');
    opt.value = key;
    if (model.historyKey === key) { opt.selected = 'selected'; }
    opt.innerHTML = key;
    input.appendChild(opt);
  });

  control.appendChild(input);

  input.addEventListener('change', (ev) => {
    dispatch({
      type: 'SELECT_DATASET',
      key: ev.target.value
    });
  });

  return control;
};

const createPredictionDistanceControl = (model, dispatch) => {
  const control = document.createElement('div');

  const input = document.createElement('input');
  input.type = 'range';
  input.value = model.predictionDistance;
  input.name = 'predictionDistance';
  input.min = '1';
  input.max = '16';
  input.step = '1';

  input.addEventListener('change', (ev) => {
    dispatch({
      type: 'SET_PREDICTION_DISTANCE',
      value: parseInt(input.value)
    });
  });

  const label = document.createElement('label');
  label.for = 'predictionDistance';
  label.innerHTML = ' ' + model.predictionDistance + ' Prediction Distance';

  control.appendChild(input);
  control.appendChild(label);

  return control;
};

const createContextDistanceControl = (model, dispatch) => {
  const control = document.createElement('div');

  const input = document.createElement('input');
  input.type = 'range';
  input.value = model.contextDistance;
  input.name = 'contextDistance';
  input.min = '1';
  input.max = '16';
  input.step = '1';

  input.addEventListener('change', (ev) => {
    dispatch({
      type: 'SET_CONTEXT_DISTANCE',
      value: parseInt(input.value)
    });
  });

  const label = document.createElement('label');
  label.for = 'contextDistance';
  label.innerHTML = ' ' + model.contextDistance + ' Context Distance';

  control.appendChild(input);
  control.appendChild(label);

  return control;
};

const createPredictionControlsElem = (model, dispatch) => {
  const controls = document.createElement('div');

  const contextDistanceElem = createContextDistanceControl(model, dispatch);
  controls.appendChild(contextDistanceElem);

  const predDistanceElem = createPredictionDistanceControl(model, dispatch);
  controls.appendChild(predDistanceElem);

  return controls;
};

const createChannelControlsElem = (model, dispatch) => {
  const controls = document.createElement('div');
  model.history.forEach((channel, i) => {
    const audio = document.createElement('div');
    audio.classList.add('channel-control');
    audio.dataset.channel = i;

    const img = document.createElement('img');
    img.width = 16;
    img.height = 16;
    img.src = 'img/audio.png';
    audio.appendChild(img);

    controls.appendChild(audio);
  });

  return controls;
};

const createFrameElem = (t) => {
  const f = document.createElement('div');
  f.classList.add('frame');

  const label = document.createElement('div');
  label.classList.add('frame-label');

  if (typeof t === 'number') {
    f.dataset.time = t;
    if (t % 4 === 0) {
      label.innerHTML = t.toString(10);
    } else {
      label.innerHTML = '';
    }
  } else {
    label.innerHTML = '' + t;
  }

  f.appendChild(label);

  return f;
};

const createCellRowElem = (t) => {
  const r = document.createElement('div');
  r.dataset.time = t;
  r.classList.add('cellrow');
  return r;
};

const createDeleteFrameElem = (t, dispatch) => {
  const b = document.createElement('button');
  b.innerHTML = 'del';

  b.addEventListener('click', () => {
    dispatch({
      type: 'REMOVE_FRAME',
      time: t
    });
  });

  return b;
};

const createDuplicateFrameElem = (t, dispatch) => {
  const b = document.createElement('button');
  b.innerHTML = 'duplicate';

  b.addEventListener('click', () => {
    dispatch({
      type: 'DUPLICATE_FRAME',
      time: t
    });
  });

  return b;
};

const createCellElem = (t, ch, value, numChannels) => {
  const cel = document.createElement('div');
  cel.dataset.time = t;
  cel.dataset.channel = ch;
  cel.dataset.value = value;
  cel.classList.add('cell');

  const probStr = ((1 - value) * 100).toFixed(0) + '%';
  cel.style.backgroundColor = 'hsl(0,0%,' + probStr + ')';

  cel.title = value;

  cel.classList.add('cell-ch' + numChannels);

  return cel;
};

const bindCellElem = (cel, dispatch) => {
  cel.addEventListener('click', () => {
    dispatch({
      type: 'SET_VALUE',
      time: cel.dataset.time,
      channel: cel.dataset.channel,
      value: parseFloat(cel.dataset.value) > 0.5 ? 0 : 1 // invert
    });
  });
};

const createTimelineElem = (model, dispatch) => {
  const timeline = document.createElement('div');
  const channels = model.history.length;
  const duration = model.history[0].length;

  let t, ch, cel, val, fr, cr;
  for (t = 0; t < duration; t += 1) {
    fr = createFrameElem(t);
    cr = createCellRowElem(t);

    if (t >= duration - model.contextDistance) {
      fr.classList.add('frame-context');
    }

    for (ch = 0; ch < channels; ch += 1) {
      val = model.history[ch][t];
      cel = createCellElem(t, ch, val, channels);
      cel.classList.add('cell-history');
      bindCellElem(cel, dispatch)
      cr.appendChild(cel);
    }
    fr.appendChild(cr);

    fr.appendChild(createDeleteFrameElem(t, dispatch));
    fr.appendChild(createDuplicateFrameElem(t, dispatch));

    timeline.appendChild(fr);
  }

  return timeline;
};

const createPredictedTimelineElem = (model, dispatch) => {
  const timeline = document.createElement('div');
  const distance = model.predictionDistance;
  const channels = model.history.length;
  const currentTime = model.history[0].length;

  const prediction = predict(model);

  let t, ch, cel, val, fr, cr;
  for (t = 0; t < distance; t += 1) {
    fr = createFrameElem(currentTime + t);
    cr = createCellRowElem(currentTime + t);

    fr.classList.add('prediction');

    for (ch = 0; ch < channels; ch += 1) {
      val = prediction[ch][t];
      cel = createCellElem(t, ch, val, channels);
      cel.classList.add('cell-prediction');
      cr.appendChild(cel);
    }
    fr.appendChild(cr);

    timeline.appendChild(fr);
  }

  return timeline;
};

const createAPriori = (model, dispatch) => {
  const container = document.createElement('div');
  const numChannels = model.history.length;
  const channelMeans = way.mean(model.history);

  const t = 0;
  let fr = createFrameElem('a priori');
  let cr = createCellRowElem(t);

  fr.classList.add('apriori');

  let c, cel, val;
  for (c = 0; c < numChannels; c += 1) {
    val = channelMeans[c][t];
    cel = createCellElem(t, c, val, numChannels);
    cel.classList.add('cell-apriori');
    cr.appendChild(cel);
  }

  fr.appendChild(cr);
  container.appendChild(fr);

  return container;
};

// History manipulation

const historySetValue = (hist, ev) => {
  const newHist = way.clone(hist);
  newHist[ev.channel][ev.time] = ev.value;
  return newHist;
}

const historyDuplicateFrame = (hist, t) => {
  const newHist = way.clone(hist);
  newHist.map((ch, i) => {
    const cellValue = ch[t];
    return ch.splice(t, 0, cellValue);
  });
  return newHist;
};

const historyRemoveFrame = (hist, t) => {
  const newHist = way.clone(hist);
  newHist.map((ch) => {
    return ch.splice(t, 1);
  });
  return newHist;
};

const predict = (model) => {
  let contextDistance = model.contextDistance;
  let distance = model.predictionDistance;
  let t = model.history[0].length;
  let context = way.before(model.history, t, contextDistance);
  let pred = mcbsp.predict(model.history, context, distance);
  return pred.probabilities;
};

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
    switch (ev.type) {

      case 'SET_CONTEXT_DISTANCE': {
        return Object.assign({}, model, {
          contextDistance: ev.value
        });
      }

      case 'SET_PREDICTION_DISTANCE': {
        return Object.assign({}, model, {
          predictionDistance: ev.value
        });
      }

      case 'SET_VALUE': {
        return Object.assign({}, model, {
          history: historySetValue(model.history, ev)
        });
      }

      case 'DUPLICATE_FRAME': {
        return Object.assign({}, model, {
          history: historyDuplicateFrame(model.history, ev.time)
        });
      }

      case 'REMOVE_FRAME': {
        return Object.assign({}, model, {
          history: historyRemoveFrame(model.history, ev.time)
        });
      }

      case 'SELECT_DATASET': {
        return Object.assign({}, model, {
          historyKey: ev.key,
          history: datasets[ev.key]
        });
      }

      default:
        return model;
    }
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
      createPredictionControlsElem(model, dispatch),
      createChannelControlsElem(model, dispatch),
      createTimelineElem(model, dispatch),
      createPredictedTimelineElem(model, dispatch),
      createAPriori(model, dispatch)
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
