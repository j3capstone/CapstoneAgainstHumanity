module.exports = function(ioc){
    /* A module to give access to the models. */
    /* I was expecting/hoping ot have more than just two models here */
    return {
        Player: require('./player.js')(),
        Game: require('./game.js')(ioc.tools.array, ioc.cards.question, ioc.cards.answer)
    };
};
