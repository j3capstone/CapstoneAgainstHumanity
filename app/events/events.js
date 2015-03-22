module.exports = function (io, hashIDs, models, games) {

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
            games = games || {};
            var count = games.length || 0;
            var gameId = hashIDs.encode(count);

            games[gameId] = models.Game(creator);

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
};
