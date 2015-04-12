var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var trashs = require('./server/trash');

// IO connection
io.on('connection', function(socket){
    //socket.on('disconnect', function(){
    //    console.log('user disconnected');
    //});
    io.emit('trash-init', trashs.all);
});

// Routing static files
app.use(express.static('client'));

// Save new collect value
app.get('/coleta/:id/:value', function (req, res) {
    var id = req.params.id;
    var value = req.params.value;
    var ret = trashs.save(id, value);
    io.emit('trash-change', ret); 
    res.send(value);
});

// usado apenas para debug
app.get('/coleta/listall', function (req, res) {
    res.send(trashs.all);  
});



http.listen(process.env.PORT || 80, function(){
  console.log('listening on *:80');
});