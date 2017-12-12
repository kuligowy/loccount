var mongoose = require('mongoose')


var LoccountEntrySchema = mongoose.Schema({
  title: String,
  amount: Number,
  loccount: String,
  txDate: Date,
  lp: Number
});

module.exports = {
  LoccountEntry: mongoose.model('LoccountEntry', LoccountEntrySchema)
}