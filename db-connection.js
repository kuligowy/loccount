var mongoose = require('mongoose')
var { rpad, randomDate } = require('./utils');
var { LoccountEntry } = require('./models/Loccount');

const createDummyData = () => {
  for (let i = 1; i <= 20; i++) {
    let entry = new LoccountEntry({
      title: 'test entry ' + rpad(i, 2),
      amount: (i * 100 * (i % 2 == 0 ? -1 : 1)),
      loccount: (i % 2 == 0 ? 'M-account' : 'P-account'),
      txDate: randomDate(new Date(2017, 12, 1), new Date()),
      lp: i
    }).save();
  }
};

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/loccount', {
  useMongoClient: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', console.log.bind(console, 'connection opened'));

LoccountEntry.collection.drop();
createDummyData();