module.exports = function(io){
    /* Another attempt at a model! */
    return function (name, game) {
        /* Construct */
        var player = {
            playerName: name,
            cards: {},
            score: 0
        };

        /* Initialize */
        player.cards = game.answerDeck.splice(0, 10);

        /* Return */
        return player;
    }
};
