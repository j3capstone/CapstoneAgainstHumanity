var express = require('express');
var app = express()

app.get('/', function (request, response) {
    response.send("Capstone Against Humanity");
});

var server = app.listen(8000, function () {
    var port = server.address().port;

    console.log('Capstone app listening port %s', port);
});
