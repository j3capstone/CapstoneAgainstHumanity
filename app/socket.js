module.exports = function (app, server) {
    'use strict';

    var io = require('socket.io')(server);
    var hashIDs = new require('hashids')('capstonesalt');
    var idCount;

    var sessions;

    var models = {
    };

    io.on('connection', function (socket) {
    });
}
