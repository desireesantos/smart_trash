var express = require('express');
var app = express();

app.use(express.static('client'));

app.get('/coleta/:id/:value', require('./server/coleta'));
app.get('/list/:id', require('./server/list'));

var server = app.listen(process.env.PORT, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});