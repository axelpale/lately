module.exports = (model, dispatch, time) => {
  const root = document.createElement('div');
  root.classList.add('row-title');
  root.innerHTML = model.frames[time].title;

  return root;
}
