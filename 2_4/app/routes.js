var express = require('express');
var path =    require('path');

var router = express.Router();
module.exports = router;

router.get('/', function(req, res) {
  var data = JSON.parse(require('fs').readFileSync('public/data/champions_data.json', 'utf8'));
  res.locals.champions = data;
  res.render('pages/index');
});
