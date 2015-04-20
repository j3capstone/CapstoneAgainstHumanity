var express = require('express');
var app = express();

var server = require('http').Server(app);

//Static file server
require('./app/static.js')(app, server);
//Socket server
require('./app/socket.js')(app, server);

