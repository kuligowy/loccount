var { LoccountEntry } = require('../models/Loccount');
var mongoose = require('mongoose');
var log4js = require('log4js');
var logger = log4js.getLogger('loccount-controller');

const loccountInfoQuery = function(inputId) {
  return {
    _id: inputId,
    entries: { $sum: 1 },
    balance: { $sum: "$amount" },
    first_tx: { $min: "$txDate" },
    latst_tx: { $max: "$txDate" }
  }
};

const getEachOne = LoccountEntry.aggregate([{ $group: loccountInfoQuery("$loccount") }]); //.exec();
//get all accounts info as report
const getCombined = LoccountEntry.aggregate([{ $group: loccountInfoQuery(null) }]); //.exec();

module.exports = {
  getLoccounts: function(req, res, next) {
    return Promise.all([getEachOne, getCombined]).then(function([loccounts, combined]) {
      if (combined && combined.length > 0) {
        combined[0]._id = 'combined';
      }
      res.json(loccounts.concat(combined));
      return
    });
  },
  //TODO switch from using LP to txDate after stable algorithm
  getLoccountEntries: function(req, res, next) {
    logger.debug('params %s', JSON.stringify(req.query));
    const limit = parseInt(req.query.size) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = page == 1 ? 0 : (page * limit) - limit;
    logger.debug('page %s -> skip %s, limit %s', page, skip, limit);
    const accounts = req.query.loccounts ? req.query.loccounts.split(',') : [];
    const query = accounts.length > 0 ? { loccount: { $in: accounts } } : {};
    const countQuery = LoccountEntry.count(query).exec();

    //take entries for extracted params
    var fetchEntries = LoccountEntry.find(query)
      .skip(skip)
      .limit(limit)
      //.sort({ txDate: 1 })
      .sort({ lp: 1 })
      .select({ __v: 0 })
      .lean()
      .exec();

    //calculate inital balance from last-tx
    var initalBalance = fetchEntries.then(function(entries) {
      if (entries && entries.length > 0) {
        //let firstDate = entries[0].txDate;
        let lp = entries[0].lp;
        return LoccountEntry.aggregate({
          $match: {
            $and: [query,
              //{ txDate: { $lt: firstDate } }
              { lp: { $lt: lp } }
            ]
          }
        }, { $group: { _id: null, sum: { $sum: "$amount" } } }).exec();
      }
      return
    });
    //enrich entries with mid-balance-snapshot
    return Promise.all([countQuery, fetchEntries, initalBalance]).then(function([count, entries, balance]) {
      const result = {};

      logger.debug('count %s', count);
      logger.debug(' balance %s', JSON.stringify(balance));
      for (let idx = 0; idx < entries.length; idx++) {
        if (idx == 0) {
          initBalance = (balance && balance.length > 0) ? balance[0].sum : entries[idx].amount;
          entries[idx].difference = initBalance;
        }
        if (idx + 1 < entries.length) {
          entries[idx + 1]["difference"] = entries[idx].difference + entries[(idx + 1)].amount;
        }
      }
      result.data = entries.reverse();
      result.dataTotal = count;
      result.pageCurrent = page;
      result.pageSize = limit;
      result.pagesTotal = Math.ceil(count / limit);
      res.json(result)
      return
    }).catch((error) => {
      logger.debug(error);
    });
  }
}