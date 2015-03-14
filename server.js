var express = require('express');
var app = express();

var serveStatic = require('serve-static');

app.use(serveStatic('public'));

var server = app.listen(8000, function () {
    var port = server.address().port;

    console.log('Capstone app listening port %s', port);
});
