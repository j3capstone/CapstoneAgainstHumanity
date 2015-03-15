module.exports = function (app, server) {
    'use strict';

    var arrayTools = require('./utils/arrayTools.js');

    var answerCards = arrayTools.ObjectToArray(require('cah-cards/answers'));
    var questionCards = arrayTools.ObjectToArray(require('cah-cards/questions'));

    var hashIDs = new require('hashids')('capstonesalt');
    var idCount = 0;

    var games;

    var models = {
        Player: function (name, game) {
            return {
                playerName: name,
                cards: game.answerDeck.splice(0, 10)
            }
        },
        Game: function (creator) {
            /* note: Array.slice() is a quick way of cloning an array */
            return {
                creator: creator,
                createdOn: Date.now(),
                questionDeck: arrayTools.Shuffle(questionCards.slice()),
                answerDeck: arrayTools.Shuffle(answerCards.slice()),
                questionDiscardPile: {},
                answerDiscardPile: {},
                currentRound: null
            }
        }
    };

    var sendPlayersNotice = function (socket) {
        io.to(socket.game).emit('updatePlayers', games[socket.game].players);
    };

    var io = require('socket.io')(server);
    io.on('connection', function (socket) {
        io.emit('gameList', games);

        socket.on('join', function (playerName, gameId){
            var game = games[gameId];

            socket.playerName = playerName;
            socket.game = gameId;
            socket.join(gameId);

            game.players = game.players ||  {};
            game.players[playerName] = game.players[playerName] || new models.Player(playerName, game);

            socket.emit('gameDetails', game, gameId)

            sendPlayersNotice(socket);
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
