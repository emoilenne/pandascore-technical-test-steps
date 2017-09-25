var express = require('express');
var path =    require('path');

var router = express.Router();
module.exports = router;

router.get('/', function(req, res) {
  var data = JSON.parse(require('fs').readFileSync('data.json', 'utf8'));
  data['champions'].sort(function (a, b) {
    a = a['name'].toLowerCase();
    b = b['name'].toLowerCase();
    return (a < b) ? -1 : (a > b) ? 1 : 0;
  })
  res.locals.data = data;
  res.render('pages/index')
});
