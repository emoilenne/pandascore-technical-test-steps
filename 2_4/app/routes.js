function get_popularity_data(data) {
  var popularity_dates = {};
  var min_date = null;
  var max_date = null;
  var all_champions = [];
  for (var match_index = 0; match_index < data['matches'].length; match_index++) {
    var match = data['matches'][match_index];
    // track every 10 days
    var timeperiod = 10;
    var date = Math.floor(match['timestamp'] / (timeperiod * 86400));
    if (!(match['champion'] in all_champions)) {
      all_champions.push(match['champion']);
    }
    if (min_date == null || date < min_date) { min_date = date; }
    if (max_date == null || date > max_date) { max_date = date; }
    date = date.toString();
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
    for (champion in popularity_dates[date]) {
      if (champion != 'total') {
        popularity_dates[date][champion] /= popularity_dates[date]['total'] / 100;
        popularity_dates[date][champion] = popularity_dates[date][champion].toFixed(3);
      }
    }
    delete popularity_dates[date]['total'];
  }
  // console.log(popularity_dates);
  // restructure data so we can easily extract it for one champion
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  var popularity_champions = {};
  for (var champion in all_champions) {
    popularity_champions[champion] = [];
    for (var date = min_date; date <= max_date; date++ ) {
      var formatted_date = new Date(date * timeperiod * 86400000);
      var date_str = months[formatted_date.getMonth()] + ' ' + formatted_date.getFullYear();
      if (!(date in popularity_dates) || !(champion.toString() in popularity_dates[date.toString()])) {
        popularity_champions[champion].push({'date': date_str, 'popularity': 0});
      }
      else {
        popularity_champions[champion].push({'date': date_str, 'popularity': popularity_dates[date.toString()][champion.toString()]});
      }
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

  var popularity = get_popularity_data(data);
  res.locals.champions = champions;
  res.locals.matches = data['matches'];
  res.locals.popularity_data = popularity;
  res.render('pages/index');
});
