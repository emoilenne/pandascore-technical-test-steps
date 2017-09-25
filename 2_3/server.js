var express =         require('express');

var app = express();
var port = 2020;

var router = require('./app/routes');
app.use('/', router);

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.listen(port, function() {
  console.log('app started');
});
