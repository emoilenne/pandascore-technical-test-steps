var express = require('express');
var app = express();
var port = 2020;

app.listen(port, function() {
  console.log('app started');
});

app.get('/', function(req, res) {
  res.send('Hello World');
});
