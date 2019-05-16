# Multi-Channel Binary Sequence Predictor

```
const history = [
  [1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0], // sun up
  [0,1,1,1,0,0,0,0,1,1,0,0,0,0,1,1,1,0,0,1,1,1,0,0] // flower open
];

const currentTime = history[0].length
const predictionDistance = 2
const contextSize = 3
const currentContext = mcbsp.past(history, currentTime, contextSize)

const pred = mcbsp.predict(history, currentContext, predictionDistance)
```

Where `pred` equals:

```
{
  probabilities: [
    [0.68, 0.69],
    [0.31, 0.53]
  ],
  prediction: [
    [1, 1],
    [0, 1]
  ]
}
```
