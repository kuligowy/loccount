var mongoose = require('mongoose')
// var Loccount = require('./models/Loccount');
var {
  LoccountEntry
} = require('./models/Loccount');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/loccount', {
  useMongoClient: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', console.log.bind(console, 'connection opened'));

LoccountEntry.collection.drop();

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

for (let i = 1; i <= 10; i++) {
  let entry = new LoccountEntry({
    title: 'test entry ' + i,
    amount: (i * 100 * (i % 2 == 0 ? -1 : 1)),
    loccount: 'test-account',
    txDate: randomDate(new Date(2017, 12, 1), new Date())
  }).save();
}
