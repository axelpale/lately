module.exports = (opts) => {
  // Options:
  //   class
  //   name
  //   label
  //
  const control = document.createElement('div');
  control.classList.add(opts.class);

  const label = document.createElement('label');
  label.classList.add('frame-label');
  label.for = opts.name;
  label.innerHTML = opts.label;
  control.appendChild(label);

  const input = document.createElement('input');
  input.type = 'range';
  input.value = opts.value;
  input.name = opts.name;
  input.min = '1';
  input.max = '16';
  input.step = '1';

  input.addEventListener('change', () => {
    opts.change(parseInt(input.value));
  });

  control.appendChild(input);

  const postlabel = document.createElement('label');
  postlabel.for = opts.name;
  postlabel.innerHTML = ' ' + opts.value;
  control.appendChild(postlabel);

  return control;
};
