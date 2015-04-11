var express = require('express');
var app = express();

app.use(express.static('client'));
app.get('/coleta/:id/:value', require('./server/coleta'));
app.get('/coleta/listall', require('./server/listall'));

var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;
});