var express = require('express');
var bodyParser = require('body-parser');

var db = require('./db');
var api = require('./api');

var app = express();
var server = app.listen(8080, function () {

  app.use('/', express.static('public'));

  var host = server.address().address;
  var port = server.address().port;
  console.log('Monkey trap listening on http://%s:%s', host, port);

});

app.use(function(req, res, next) {  
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

api.addRoutes(app);

