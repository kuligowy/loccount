var express = require('express');
var log4js = require('log4js');
var router = express.Router();
var logger = log4js.getLogger('api');
var mongoose = require('mongoose');
var {
  LoccountEntry
} = require('../models/Loccount');

router.get('/loccount', function(req, res, next) {
  LoccountEntry.distinct('loccount', function(err, result) {
    if (err) {
      console.log(err)
    }
    res.json(result);
  });

});

/* GET users listing. */
router.get('/loccount/:loccount', function(req, res, next) {
  let count;
  let page = req.query.page - 1 || 0;
  let size = parseInt(req.query.size) || 10;
  let query = { loccount: req.params.loccount };
  ///////
  LoccountEntry.count({ loccount: req.params.loccount }).exec()
    .then(count => {
      logger.debug('count %s', count);
      count < page * size
      logger.debug('size %s, skip %s, page %s', size, page === 0 ? 0 : (page * size) - size, page)
      return LoccountEntry
        .find(query)
        .limit(size)
        .skip(page === 0 ? 0 : (page * size) - size)
        .sort({ txDate: 1 })
        .select({ __v: 0 })
        .lean()
        .exec();
    })
    .then(entries => {
      for (let idx = 0; idx < entries.length; idx++) {
        if (idx == 0)
          entries[idx].difference = entries[idx].amount || 0;
        if (idx + 1 < entries.length) {
          logger.debug('idx %s, idx+1 %s', idx, idx - 1)
          logger.debug('%s, %s', entries[idx].title, entries[(idx + 1)].title)
          entries[idx + 1]["difference"] = entries[idx].difference + entries[(idx + 1)].amount;
        }
      }
      entries.reverse();
      res.json(entries)
    })
    .catch(function(error) { logger.error(error); })
});

module.exports = router;