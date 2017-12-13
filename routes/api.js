var express = require('express');
var log4js = require('log4js');
var router = express.Router();
var logger = log4js.getLogger('api');
var mongoose = require('mongoose');
var loccount = require('./loccount');

/* GET list of accounts */
router.use('/loccount', loccount);
// //get distinct accounts from entries
// const getEachOne = LoccountEntry.aggregate([{
//   $group: loccountInfoQuery("$loccount")
// }]).exec();
// //get all accounts info as report
// const getCombined = LoccountEntry.aggregate([{
//   $group: loccountInfoQuery(null),
// }]).exec();
//
// return Promise.all([getEachOne, getCombined]).then(function([loccounts, combined]) {
//   if (combined && combined.length > 0) {
//     combined[0]._id = 'combined';
//   }
//   res.json(loccounts.concat(combined));
//   return
// });
// });

module.exports = router;