module.exports = function (io, hashIDs, models, games) {

    var count = 0;
    var sendPlayersNotice = function (socket) {
        /* Send the 'updatePlayers' message, and send the current list of players */
        io.to(socket.game).emit('updatePlayers', games[socket.game].players);
    };

    var endRound = function (game) {
        /* Next player is the card czar */
        game.chooseNewCardCzar();
        /* We need a new question card */
        game.drawNewQuestionCard();
        /* Empty the current list of "in play" cards */
        game.inPlay = {};
    };

    var sendCardsNotice = function (socket) {
        /* @TODO Check if all cards are played, and if so, send allCardsPlayed instead */
        socket.emit('updateHand', games[socket.game].players[socket.playerName].cards);
        io.to(socket.game).emit('updateCards', games[socket.game].inPlay);
    };

    var sendRoundOverNotice = function (socket, winner, answer) {
        /* Send the 'roundOver' message, and send the player who won the round, along with their answer card */
        io.to(socket.game).emit('roundOver', winner.playerName, answer);
        /* Send the 'gameDetails' message, and send the game object again so the client can refresh the data */
        io.to(socket.game).emit('gameDetails', games[socket.game])
    };

    var sendGameOverNotice = function (socket, winner, answer) {
        /* Send the 'gameOver' message, and send the player who won the game, along with their last answer card */
        io.to(socket.game).emit('gameOver', winner.playerName, answer);
    };

    var sendNewQuestionCardNotice = function (socket) {
        /* Draw a new question card */
        games[socket.game].drawNewQuestionCard();
        /* Send the 'questionCard' message, and send the new question card */
        io.to(socket.game).emit('questionCard', games[socket.game].questionCard);
    };

    /* Whenever somebody connects... */
    io.on('connection', function (socket) {
        /* Send them a list of the games! */
        io.emit('gameList', games);

        /* Whenever somebody joins a game... */
        socket.on('join', function (playerName, gameId){
            /* Grab the game object */
            var game = games[gameId];

            /* Assign a playername and game to this connection */
            socket.playerName = playerName;
            socket.game = gameId;
            /* Subscribe to the game's messages */
            socket.join(gameId);

            /* Grab the game's player list or create a new one */
            game.players = game.players ||  {};
            /* Grab the current player or create a new one (if rejoining game they're already in) */
            game.players[playerName] = game.players[playerName] || new models.Player(playerName, game);

            /* Update the new player with the game details */
            socket.emit('gameDetails', game);

            /* Refresh the list of players */
            sendPlayersNotice(socket);
        });

        /* Whenever somebody creates a game... */
        socket.on('createGame', function (creator) {
            /* Grab the game list or create a new one */
            games = games || {};
            /* Create a unique ID for the game URL */
            var gameId = hashIDs.encode(count++);

            /* Add a new game to the games list */
            games[gameId] = models.Game(creator);

            /* Re-send the list of games to anybody listening */
            io.emit('gameList', games);
            /* Let the player creating the game know the game was created */
            socket.emit('gameCreated', gameId);
        });

        /* Whenever a player plays a card... */
        socket.on('playCard', function (playerName, cardId) {
            /* Grab the card object given the player's name and card ID */
            var card = games[socket.game].players[playerName].cards.splice(cardId,1);
            /* Add the card to the "In play" list */
            games[socket.game].inPlay[playerName] = card;

            /* Take a card off the deck and put it in the players and... */
            games[socket.game].players[playerName].cards.push(games[socket.game].answerDeck.shift());

            /* Refresh the player's cards */
            sendCardsNotice(socket);
        });

        /* Whenever the card czar chooses a card... */
        socket.on('chooseCard', function (playerChoosing, playerChosen) {
            /* Make sure they're the card czar first! */
            if(playerChoosing != games[socket.game].cardCzar) {
                /* If not, they're a DIRTY CHEATER! */
                socket.emit('error', 'You\'re not the Card Czar!');
            } else {
                /* Otherwise, they're legit, and we should grab the player who played the chosen card and increment their score */
                var winner = games[socket.game].players[playerChosen];
                winner.score++;

                /* Keep track of the winning answer card */
                var answer = games[socket.game].inPlay[playerChosen];

                /* And see if the player just won the game! */
                if (winner.score < 10) {
                    /* If not, end the round... */
                    endRound(games[socket.game]);
                    /* And update the clients in the game */
                    sendRoundOverNotice(socket, winner, answer);
                } else {
                    /* Otherwise, end the game and let everyone know who won */
                    sendGameOverNotice(socket, winner, answer);
                }
            }
        });
    });
};
