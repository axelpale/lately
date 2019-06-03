const reduxish = require('./lib/reduxish');
const way = require('senseway');

const renderers = [
  require('./channelTitleEditor/render'),
  require('./channelTitles/render'),
  require('./timelineViewer/render')
];

const reducers = [
  require('./channelTitleEditor/reduce'),
  require('./channelTitles/reduce'),
  require('./timelineViewer/reduce')
];

const u = null;

module.exports = () => {
  reduxish({
    defaultModel: {
      timeline: [
        [1, 1, 1, u, u, u, u],
        [u, 1, 1, u, u, u, u],
        [u, 1, 1, u, u, u, u],
        [u, 1, 1, u, u, u, u],
        [0, 1, 0, u, u, u, u],
        [0, 0, 0, u, u, u, u],
      ],
      frames: [
        { title: '2019-06-01' },
        { title: '2019-06-02' },
        { title: '2019-06-03' },
        { title: '2019-06-04' },
        { title: '2019-06-05' },
        { title: '2019-06-06' },
        { title: '2019-06-07' }
      ],
      channels: [ // Dimensions
        {
          title: 'Aamiainen',
          backgroundColor: '#8A1C82'
        },
        {
          title: 'Ulkoilu',
          backgroundColor: '#BF0F73'
        },
        {
          title: 'Sarjan katselu',
          backgroundColor: '#201969'
        },
        {
          title: 'Kasvien kastelu',
          backgroundColor: '#223E85'
        },
        {
          title: 'Kiipeily',
          backgroundColor: '#223E85'
        },
        {
          title: 'Uiminen',
          backgroundColor: '#223E85'
        }
      ],
      channelOnEdit: null
    },
    storageName: 'future-model',
    rootElementId: 'content',
    renderers: renderers,
    reducers: reducers
  })
};
