module.exports = {
    ObjectToArray: function (object) {
        return Object.keys(object).map(function(key) { return object[key] });
    },
    Clone: function (array) {
        return array.splice();
    },
    Shuffle: function (array) {
        var counter = array.length;
        var index;
        var out = [];

        while (counter > 0) {
            index = Math.floor(Math.random() * counter);

            counter--;

            temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
    }
}
