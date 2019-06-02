const reduxish = require('./lib/reduxish');
const way = require('senseway');

const renderers = [
  require('./timelineViewer/render')
];

const reducers = [
  require('./timelineViewer/reduce')
];

module.exports = () => {
  reduxish({
    defaultModel: {
      timeline: [
        [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
        [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0],
        [0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0],
        [0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0]
      ],
      channels: [
        {
          backgroundColor: '#8A1C82'
        },
        {
          backgroundColor: '#BF0F73'
        },
        {
          backgroundColor: '#201969'
        },
        {
          backgroundColor: '#223E85'
        }
      ]
    },
    storageName: 'future-model',
    rootElementId: 'content',
    renderers: renderers,
    reducers: reducers
  })
};
