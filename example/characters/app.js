
var $ = require('jquery');
var lately = require('../../index');
var distToHtml = require('./lib/distToHtml');
var inspectionToHtml = require('./lib/inspectionToHtml');

var ly = new lately.Lately();
var $input = $('#input');
var $pred = $('#prediction');
var $anal = $('#analysis');


$input.on('input', function () {
  var val = $input.val();
  var lastChar = val.slice(-1);

  ly.feed(lastChar);
  var d = ly.predict();
  var i = ly.inspect();

  $pred.html(distToHtml(d));
  $anal.html(inspectionToHtml(i));

});
