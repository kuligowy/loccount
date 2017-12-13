var express = require('express');
var log4js = require('log4js');
var logger = log4js.getLogger('loccount-router');
var router = express.Router();

var { getLoccounts, getLoccountEntries } = require('../controllers/loccountController.js');

/* GET list of accounts */
router.get('/', getLoccounts);
router.get('/:loccount?/entries', getLoccountEntries);

module.exports = router;