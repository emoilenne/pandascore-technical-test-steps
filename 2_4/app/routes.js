function get_popularity_data(matches) {
  process.stdout.write("Getting popularity data... ");
  var popularity_dates = {};
  var min_date = null;
  var max_date = null;
  var all_champions = [];
  for (var match_index = 0; match_index < matches.length; match_index++) {
    var match = matches[match_index];
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
  console.log("done.");
  return popularity_champions;
}

function get_roles_data(matches) {
  process.stdout.write("Getting roles data... ");
  var roles_data = {};
  var champion;
  for (var match_index = 0; match_index < matches.length; match_index++) {
    var match = matches[match_index];
    champion = match['champion'].toString();
    if (!(champion in roles_data)) {
      roles_data[champion] = {'total': 0};
    }
    if (!(match['role'] in roles_data[champion])) {
      roles_data[champion][match['role']] = 0;
    }
    roles_data[champion][match['role']] += 1;
    roles_data[champion]['total'] += 1;

  }

  roles_data_raw = {};

  for (champion in roles_data) {
    for (role in roles_data[champion]) {
      if (role != 'total') {
        roles_data[champion][role] /= roles_data[champion]['total'] / 100;
      }
    }
    delete roles_data[champion]['total'];

    roles_data_raw[champion] = [];
    for (role in roles_data[champion]) {
      roles_data_raw[champion].push({'role': capitalize(role), 'data': roles_data[champion][role].toFixed(1)});
    }

    roles_data_raw[champion].sort(function (a, b) {
      a = a['data'];
      b = b['data'];
      return (a > b) ? -1 : (a < b) ? 1 : 0;
    });
  }
  console.log("done.");
  return roles_data_raw;
}


function capitalize(str) {
  return str
      .toLowerCase()
      .split('_')
      .map(function(word) {
          return word[0].toUpperCase() + word.substr(1);
      })
      .join(' ');
 }



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
  });

  res.locals.champions = data['champions'];
  res.locals.matches = data['matches'];
  res.locals.popularity_data = get_popularity_data(data['matches']);
  res.locals.roles_data = get_roles_data(data['matches']);
  res.render('pages/index');
});
