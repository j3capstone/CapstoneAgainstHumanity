module.exports = function (app, server) {
    'use strict';

    var hashIDs = new require('hashids')('capstonesalt');
    var idCount = 0;

    var games;

    var models = {
        Player: function (name) {
            return {
                name: name
            }
        },
        Game: function (creator) {
            return {
                creator: creator,
                createdOn: Date.now(),
                currentRound: null
            }
        }
    };

    var io = require('socket.io')(server);
    io.on('connection', function (socket) {
        io.emit('gameList', games);

        socket.on('join', function (username, gameId){
        });

        socket.on('createGame', function (creator) {
            var gameId = hashIDs.encode(idCount);
            idCount++;
            games = games || {};
            games[gameId] = new models.Game(creator);

            io.emit('gameList', games);
            socket.emit('gameCreated', gameId);
        });
    });
}
