module.exports = function(ioc){
    return {
        Player: require('./player.js')(),
        Game: require('./game.js')(ioc.tools.array, ioc.cards.question, ioc.cards.answer)
    };
};
