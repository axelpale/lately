
module.exports = (model, dispatch) => {
  const root = document.createElement('div')
  root.classList.add('row')

  const h = document.createElement('h2')
  h.innerHTML = 'How this prediction was made'
  root.appendChild(h)

  return root
};
