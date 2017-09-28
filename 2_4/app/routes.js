function get_popularity_data(data) {
  var popularity_dates = {};

  for (var match_index = 0; match_index < data['matches'].length; match_index++) {
    var match = data['matches'][match_index];
    var date = Math.floor(match['timestamp'] / 864000).toString();
    if (!(date in popularity_dates)) {
      popularity_dates[date] = { 'total': 0};
    }
    if (!(match['champion'].toString() in popularity_dates[date])) {
      popularity_dates[date][match['champion'].toString()] = 0;
    }
    popularity_dates[date][match['champion'].toString()]++;
    popularity_dates[date]['total']++;
  }
  for (var date in popularity_dates) {
    for (var champion_index = 0; champion_index < date.length; champion_index++) {
      date[champion_index] /= date['total'] / 100;
    }
    delete date['total'];
  }
  // console.log(popularity_dates);
  // restructure data so we can easily extract it for one champion
  var popularity_champions = [];
  for (var date in popularity_dates) {
    for (var champion in popularity_dates[date]) {
      popularity_champions.push({'champion': champion, 'date' : date});
    }
  }
  return popularity_champions;
}



var express = require('express');
var path =    require('path');

var router = express.Router();
module.exports = router;

router.get('/', function(req, res) {
  var data = JSON.parse(require('fs').readFileSync('data.json', 'utf8'));
  var champions = data['champions'];
  champions.sort(function (a, b) {
    a = a['name'].toLowerCase();
    b = b['name'].toLowerCase();
    return (a < b) ? -1 : (a > b) ? 1 : 0;
  });
  res.locals.champions = champions;
  res.locals.matches = data['matches'];
  res.locals.popularity_data = get_popularity_data(data);
  res.render('pages/index');
});
