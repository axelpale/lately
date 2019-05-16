// Visual concepts
// - timeline: the sequence and all channels
// - sequence: the state of the cells in the timeline
// - channel: a dimension of each time frame
// - frame: a state of each channel at a given time
// - cell: a state of a channel at a given time

const createFrameElem = (t) => {
  const f = document.createElement('div');
  f.dataset.time = t;
  f.classList.add('frame');
  return f;
};

const createCellElem = (t, ch, value, numChannels) => {
  const cel = document.createElement('div');
  cel.dataset.time = t;
  cel.dataset.channel = ch;
  cel.classList.add('cell');

  if (value === 1) {
    cel.classList.add('cell-on');
  }

  cel.classList.add('cell-ch' + numChannels);

  return cel;
};

const bindCellElem = (cel, dispatch) => {
  cel.addEventListener('click', () => {
    dispatch({
      type: 'SET_VALUE',
      time: cel.dataset.time,
      channel: cel.dataset.channel,
      value: cel.classList.contains('cell-on') ? 0 : 1
    });
  });
};

const clearElem = (el) => {
  while(el.firstChild){
    el.removeChild(el.firstChild);
  }
  return el;
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
    timeline.appendChild(fr);
  }

  return timeline;
};

const historySet = (hist, t, ch, value) => {
  const newHist = hist.map((ch) => {
    return ch.slice()
  })
  newHist[ch][t] = value;
  return newHist;
}

{
  const initialModel = {
    history: [
      [1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0], // sun up
      [0,1,1,1,0,0,0,0,1,1,0,0,0,0,1,1,1,0,0,1,1,1,0,0] // flower open
    ]
  };
  let currentModel = initialModel;

  const reducer = (model, ev) => {
    switch (ev.type) {
      case 'SET_VALUE':
        return Object.assign({}, model, {
          history: historySet(model.history, ev.time, ev.channel, ev.value)
        })
      default:
        return model;
    }
  };

  const render = (model) => {
    const timeline = createTimelineElem(model.history, dispatch);
    const timelineContainer = document.getElementById('timeline');
    clearElem(timelineContainer);
    timelineContainer.appendChild(timeline);
  };

  const dispatch = (ev) => {
    const newModel = reducer(currentModel, ev);
    render(newModel);
    currentModel = newModel;
  };

  // Init
  render(initialModel);
};
