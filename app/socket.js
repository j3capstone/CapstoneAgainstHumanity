module.exports = function (app, server) {
    'use strict';

    var arrayTools = require('./utils/arrayTools.js');

    var answerCards = require('cah-cards/answers');
    var questionCards = require('cah-cards/questions');

    var hashIDs = new require('hashids')('this is my super unoriginal salt for the capstone project');
    var idCount = 0;

    var games;

    var models = {
        Player: function (name, game) {
            return {
                playerName: name,
                cards: game.answerDeck.splice(0, 10),
                score: 0
            }
        },
        Game: function (creator) {
            var newGame = {
                questionDeck: arrayTools.Shuffle(arrayTools.Filter(arrayTools.ObjectToArray(questionCards))),
                answerDeck: arrayTools.Shuffle(arrayTools.Filter(arrayTools.ObjectToArray(answerCards))),
                creator: creator,
                cardCzar: creator,
                createdOn: Date.now(),
                inPlay: {},
                players: null,
                currentRound: null,
                questionCard: null,
                questionDiscardPile: [],
                answerDiscardPile: [],
                drawNewQuestionCard: function() {
                    this.questionDiscardPile.push(this.questionCard);
                    this.questionCard = this.questionDeck.shift();
                },
                chooseNewCardCzar: function() {
                    var playerIds = Object.keys(this.players);
                    var index = playerIds.indexOf(this.cardCzar);

                    if (index == -1) {
                        this.cardCzar = playerIds[0];
                    } else if (playerIds[index+1]) {
                        this.cardCzar = playerIds[index+1];
                    } else {
                        this.cardCzar = playerIds[0];
                    }
                }
            };

            newGame.questionCard = newGame.questionDeck.shift();
            return newGame;
        }
    };

    var sendPlayersNotice = function (socket) {
        io.to(socket.game).emit('updatePlayers', games[socket.game].players);
    };

    var endRound = function (game) {
        game.chooseNewCardCzar();
        game.drawNewQuestionCard();
        game.inPlay = {};
    };

    var sendCardsNotice = function (socket) {
        //@TODO Check if all cards are played, and if so, send allCardsPlayed instead
        socket.emit('updateHand', games[socket.game].players[socket.playerName].cards);
        io.to(socket.game).emit('updateCards', games[socket.game].inPlay);
    };

    var sendRoundOverNotice = function (socket, winner, answer) {
        io.to(socket.game).emit('roundOver', winner.playerName, answer);
        io.to(socket.game).emit('gameDetails', games[socket.game])
    };

    var sendNewQuestionCardNotice = function (socket) {
        games[socket.game].drawNewQuestionCard();
        io.to(socket.game).emit('questionCard', games[socket.game].questionCard);
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

            socket.emit('gameDetails', game);

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

        socket.on('playCard', function (playerName, cardId) {
            var card = games[socket.game].players[playerName].cards.splice(cardId,1);
            games[socket.game].inPlay[playerName] = card;

            games[socket.game].players[playerName].cards.push(games[socket.game].answerDeck.shift());
            // socket.emit('cardPlayed', playerName, answerCards[cardId]);
            sendCardsNotice(socket);
        });

        socket.on('chooseCard', function (playerChoosing, playerChosen) {
            if(playerChoosing != games[socket.game].cardCzar) {
                socket.emit('error', 'You\'re not the Card Czar!');
            } else {
                var winner = games[socket.game].players[playerChosen];
                winner.score++;

                var answer = games[socket.game].inPlay[playerChosen];

                if (winner.score < 10) {
                    endRound(games[socket.game]);
                    sendRoundOverNotice(socket, winner, answer);
                } else {
                    sendGameOverNotice(socket, winner, answer);
                }
            }
        });
    });
}
