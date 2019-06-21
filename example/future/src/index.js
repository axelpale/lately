const reduxish = require('./lib/reduxish');
const way = require('senseway');

const renderers = [
  require('./menu/render'),
  require('./channelTitleEditor/render'),
  require('./channelTitles/render'),
  require('./timelineViewer/render'),
  require('./howViewer/render')
];

const reducers = [
  require('./menu/reduce'),
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
        //                                   13.6.
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, u, u, u], // aami
        [u, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, u, u, u], // ulko
        [u, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, u, u, u], // sarj
        [u, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, u, u, u], // kast
        [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, u, u, u], // kiip
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, u, u, u], // uimi
        [u, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, u, u, u], // fiil
        [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, u, u, u], // ohje
        [1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, u, u, u], // koti
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, u, u, u], // ilok
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, u, u, u], // kilt
        [u, u, u, u, u, 1, 1, 0, 0, 1, 0, 0, 1, u, u, u], // musa
        [u, u, u, u, u, 0, 0, 0, 0, 0, 0, 0, 0, u, u, u]  // soit
      ],
      frames: [
        { title: 'la 1.6.' },
        { title: 'su 2.6.' },
        { title: 'ma 3.6.' },
        { title: 'ti 4.6.' },
        { title: 'ke 5.6.' },
        { title: 'to 6.6.' },
        { title: 'pe 7.6.' },
        { title: 'la 8.6.' },
        { title: 'su 9.6.' },
        { title: 'ma 10.6.' },
        { title: 'ti 11.6.' },
        { title: 'ke 12.6.' },
        { title: 'to 13.6.' },
        { title: 'pe 14.6.' },
        { title: 'la 15.6.' },
        { title: 'su 16.6.' },
      ],
      channels: [ // Dimensions
        {
          title: 'Aamiai&shy;nen'
        },
        {
          title: 'Ulkoilu'
        },
        {
          title: 'Sarjan katselu'
        },
        {
          title: 'Kasvien kastelu'
        },
        {
          title: 'Kiipeily'
        },
        {
          title: 'Uiminen'
        },
        {
          title: 'Hyvä fiilis'
        },
        {
          title: 'Ohjel&shy;moin&shy;ti'
        },
        {
          title: 'Koti-ilta'
        },
        {
          title: 'Ilokivi-ilta'
        },
        {
          title: 'Kiltailta'
        },
        {
          title: 'Kuun&shy;telu'
        },
        {
          title: 'Soittelu'
        }
      ],
      channelOnEdit: null,
      contextLength: 7,
      frameOnEdit: null,
      how: {
        select: {
          channel: 0,
          time: 0
        }
      },
      version: 0 // data model version
    },
    storageName: 'future-model',
    rootElementId: 'content',
    renderers: renderers,
    reducers: reducers
  })
};
