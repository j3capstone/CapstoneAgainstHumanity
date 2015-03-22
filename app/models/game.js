module.exports = function(arrayTools, questionCards, answerCards){
    return function (creator) {
        /* Construct */
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

        /* Initialize */
        newGame.questionCard = newGame.questionDeck.shift();

        /* Return */
        return newGame;
    }
};
