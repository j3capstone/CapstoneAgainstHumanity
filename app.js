var express = require('express');
var app = express();

var server = require('http').Server(app);

require('./app/static.js')(app, server);
require('./app/socket.js')(app, server);

