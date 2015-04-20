module.exports = function(){
    /* This is an Inversion of Control container. */
    /* Being used to non-JavaScript languages, and a fan of strict typing, I was thinking this would be more useful. It wasn't. */
    return {
        hashIDs: require('hashids')('this is my super unoriginal salt for the capstone project'),
        cards: {
            answer: require('cah-cards/answers'),
            question: require('cah-cards/questions')
        },
        tools: {
            array: require('../utils/arrayTools.js')
        }
    };
}();
