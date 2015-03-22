module.exports = function(){
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
