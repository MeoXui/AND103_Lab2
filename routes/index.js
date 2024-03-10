var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Lab 2 - AND 103',
    class: 'MD18303',
    name: 'Huynk',
    id: 'PH38086'
  });
});

module.exports = router;
