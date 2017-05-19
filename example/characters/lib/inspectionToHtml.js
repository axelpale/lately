module.exports = function (insp) {
  // Inspection to HTML

  return '<pre>' + JSON.stringify(insp, null, 2) + '</pre>';
};
