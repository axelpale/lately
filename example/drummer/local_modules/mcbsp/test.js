// Testing

const mcbsp = require('./multi');

const history = [
  [1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0], // sun up
  [0,1,1,1,0,0,0,0,1,1,0,0,0,0,1,1,1,0,0,1,1,1,0,0] // flower open
];

const printSlice = (slice) => {
  slice.forEach(channel => console.log(channel));
};

console.log('past', mcbsp.past(history, 3, 2));
console.log('future', mcbsp.future(history, 3, 2));
console.log('moment', mcbsp.moment(history, 3, 2, 2));

{
  console.log('');
  let a = mcbsp.past(history, 3, 2);
  let b = mcbsp.past(history, 9, 2);
  let sim = mcbsp.similarity(a, b);
  console.log('similarity(a, b) =', sim + ', where');
  console.log('a');
  printSlice(a);
  console.log('b');
  printSlice(b);
}

{
  console.log('');
  let t = history[0].length
  let distance = 2
  let context = mcbsp.past(history, t, 3)
  let pred = mcbsp.predict(history, context, distance);
  console.log('predict', distance);
  console.log('  in context', JSON.stringify(context));
  pred.moments.forEach((mom, index) => {
    let w = JSON.stringify(mom.past) + JSON.stringify(mom.future);
    console.log('  t=' + mom.t + ':', w, 'simil=' + pred.weights[index]);
  });
  console.log('  prediction:', JSON.stringify(pred.prediction));
}
