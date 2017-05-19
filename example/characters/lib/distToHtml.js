module.exports = function (d) {
  // Distribution to HTML

  var ordered = Object.keys(d).map(function (key) {
    return [key, d[key]];
  }).sort(function (a, b) {
    return b[1] - a[1];
  });

  var lis = ordered.map(function (pair) {
    return '<tr>' +
      '<td class="event">' + pair[0] + '</td>' +
      '<td class="prob">' + pair[1] + '</td>' +
      '</tr>';
  }).reduce(function (acc, li) {
    return acc + li;
  }, '');

  return '<table class="table table-condensed">' +
    '<thead><tr>' +
    '<th>Event</th>' +
    '<th>Probability</th>' +
    '</tr></thead>' +
    '<tbody>' + lis + '</tbody>' +
    '</table>';
};
