var { LoccountEntry } = require('../models/Loccount');
var mongoose = require('mongoose');

const loccountInfoQuery = function(zzz) {
  return {
    _id: zzz,
    entries: { $sum: 1 },
    balance: { $sum: "$amount" },
    first_tx: { $min: "$txDate" },
    latst_tx: { $max: "$txDate" }
  }
};

const getEachOne = LoccountEntry.aggregate([{
  $group: loccountInfoQuery("$loccount")
}]); //.exec();

//get all accounts info as report
const getCombined = LoccountEntry.aggregate([{
  $group: loccountInfoQuery(null),
}]); //.exec();

module.exports = {
  getLoccounts: function(req, res) {
    return Promise.all([getEachOne, getCombined]).then(function([loccounts, combined]) {
      if (combined && combined.length > 0) {
        combined[0]._id = 'combined';
      }
      res.json(loccounts.concat(combined));
      return
    });
  },
  getLoccountEntries: function() {

  }
}