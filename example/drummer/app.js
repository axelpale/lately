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

const createCellElem = (t, ch) => {
  const cel = document.createElement('div');
  cel.dataset.time = t;
  cel.dataset.channel = ch;
  cel.classList.add('cell');
  return cel;
};

{
  const timeline = document.getElementById('timeline');

  let t, ch, fr;
  for (t = 0; t < 6; t += 1) {
    fr = createFrameElem(t);
    for (ch = 0; ch < 4; ch += 1) {
      fr.appendChild(createCellElem(t, ch));
    }
    timeline.appendChild(fr);
  }
}
