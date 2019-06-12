const reduxish = require('./lib/reduxish');
const way = require('senseway');

const renderers = [
  require('./channelTitleEditor/render'),
  require('./channelTitles/render'),
  require('./timelineViewer/render'),
  require('./howViewer/render')
];

const reducers = [
  require('./channelTitleEditor/reduce'),
  require('./channelTitles/reduce'),
  require('./timelineViewer/reduce'),
  require('./howViewer/reduce')
];

const u = null;

module.exports = () => {
  reduxish({
    defaultModel: {
      timeline: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, u], // aami
        [u, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, u, u], // ulko
        [u, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, u], // sarj
        [u, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, u], // kast
        [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, u, u], // kiip
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, u], // uimi
        [u, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, u], // fiil
        [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, u], // ohje
        [1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, u], // koti
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, u], // ilok
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, u]  // kilt
      ],
      frames: [
        { title: '1.6.' },
        { title: '2.6.' },
        { title: '3.6.' },
        { title: '4.6.' },
        { title: '5.6.' },
        { title: '6.6.' },
        { title: '7.6.' },
        { title: '8.6.' },
        { title: '9.6.' },
        { title: '10.6.' },
        { title: '11.6.' },
        { title: '12.6.' },
        { title: '13.6.' }
      ],
      channels: [ // Dimensions
        {
          title: 'Aamiai&shy;nen',
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
          backgroundColor: '#4f92a6'
        },
        {
          title: 'Uiminen',
          backgroundColor: '#38ab73'
        },
        {
          title: 'Hyvä fiilis',
          backgroundColor: '#f0c432'
        },
        {
          title: 'Ohjel&shy;moin&shy;ti',
          backgroundColor: '#ffa23e'
        },
        {
          title: 'Koti-ilta',
          backgroundColor: '#ffa23e'
        },
        {
          title: 'Ilokivi-ilta',
          backgroundColor: '#ffa23e'
        },
        {
          title: 'Kiltailta',
          backgroundColor: '#ffa23e'
        }
      ],
      channelOnEdit: null,
      contextLength: 5,
      frameOnEdit: null,
      how: {
        select: {
          channel: 0,
          time: 0
        }
      }
    },
    storageName: 'future-model',
    rootElementId: 'content',
    renderers: renderers,
    reducers: reducers
  })
};
