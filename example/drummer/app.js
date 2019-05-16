// Visual concepts
// - timeline: the sequence and all channels
// - sequence: the state of the cells in the timeline
// - channel: a dimension of each time frame
// - frame: a state of each channel at a given time
// - cell: a state of a channel at a given time
const mcbsp = require('mcbsp');

const clearElem = (el) => {
  while(el.firstChild){
    el.removeChild(el.firstChild);
  }
  return el;
};

const createFrameElem = (t) => {
  const f = document.createElement('div');
  f.dataset.time = t;
  f.classList.add('frame');
  return f;
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

const createCellElem = (t, ch, value, numChannels) => {
  const cel = document.createElement('div');
  cel.dataset.time = t;
  cel.dataset.channel = ch;
  cel.dataset.value = value;
  cel.classList.add('cell');

  const valStr = ((1 - value) * 100).toFixed(0) + '%';
  cel.style.backgroundColor = 'hsl(0,0%,' + valStr + ')';
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

const createTimelineElem = (hist, dispatch) => {
  const timeline = document.createElement('div');
  const channels = hist.length;
  const duration = hist[0].length;

  let t, ch, cel, val, fr;
  for (t = 0; t < duration; t += 1) {
    fr = createFrameElem(t);
    for (ch = 0; ch < channels; ch += 1) {
      val = hist[ch][t];
      cel = createCellElem(t, ch, val, channels);
      bindCellElem(cel, dispatch)
      fr.appendChild(cel);
    }

    fr.appendChild(createDeleteFrameElem(t, dispatch));
    timeline.appendChild(fr);
  }

  return timeline;
};

const createPredictedTimelineElem = (prediction) => {
  const timeline = document.createElement('div');
  const channels = prediction.length;
  const duration = prediction[0].length;

  let t, ch, cel, val, fr;
  for (t = 0; t < duration; t += 1) {
    fr = createFrameElem(t);
    fr.classList.add('prediction');

    for (ch = 0; ch < channels; ch += 1) {
      val = prediction[ch][t];
      cel = createCellElem(t, ch, val, channels);
      fr.appendChild(cel);
    }

    timeline.appendChild(fr);
  }

  return timeline;
};

const historyClone = (hist) => {
  return hist.map((ch) => {
    return ch.slice()
  })
}

const historySetValue = (hist, ev) => {
  const newHist = historyClone(hist);
  newHist[ev.channel][ev.time] = ev.value;
  return newHist;
}

const historyRemoveFrame = (hist, t) => {
  const newHist = historyClone(hist);
  newHist.map((ch) => {
    return ch.splice(t, 1);
  });
  return newHist;
}

const predict = (history) => {
  let contextSize = 8;
  let predictionSize = 4;
  let t = history[0].length;
  let context = mcbsp.past(history, t, contextSize);
  let pred = mcbsp.predict(history, context, predictionSize);
  return pred.probabilities;
};

{
  const initialModel = {
    history: [
      [1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0], // sun up
      [0,1,1,1,0,0,0,0,1,1,0,0,0,0,1,1,1,0,0,1,1,1,0,0] // flower open
    ],
    prediction: [[], []]
  };
  initialModel.prediction = predict(initialModel.history, 3)
  let currentModel = initialModel;

  const reducer = (model, ev) => {
    switch (ev.type) {

      case 'SET_VALUE': {
        const newHist = historySetValue(model.history, ev);
        const newPred = predict(newHist, 3);
        return Object.assign({}, model, {
          history: newHist,
          prediction: newPred
        });
      }

      case 'REMOVE_FRAME': {
        const newHist = historyRemoveFrame(model.history, ev.time);
        const newPred = predict(newHist, 3);
        return Object.assign({}, model, {
          history: newHist,
          prediction: newPred
        });
      }

      default:
        return model;
    }
  };

  const render = (model) => {
    const timelineContainer = document.getElementById('timeline');
    clearElem(timelineContainer);

    const timeline = createTimelineElem(model.history, dispatch);
    const predictedTimeline = createPredictedTimelineElem(model.prediction);

    timelineContainer.appendChild(timeline);
    timelineContainer.appendChild(predictedTimeline);
  };

  const dispatch = (ev) => {
    const newModel = reducer(currentModel, ev);
    render(newModel);
    currentModel = newModel;
  };

  // Init
  render(initialModel);
};
