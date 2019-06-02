const way = require('senseway');

module.exports = (model, dispatch) => {
  const root = document.createElement('div');

  const h2 = document.createElement('h2');
  h2.innerHTML = 'Timeline here';
  root.appendChild(h2);

  return root;
};
