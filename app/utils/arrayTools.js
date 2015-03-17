module.exports = {
    ObjectToArray: function (object) {
        return Object.keys(object).map(function(key) { return object[key] });
    },
    Clone: function (array) {
        return array.splice(0);
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
    },
    Filter: function (array) {
        /* Filter to a select few somewhat more class-appropriate cards */
        var allowed = [18, 26, 43, 47, 83, 95, 111, 143, 174, 190, 193,
            201, 239, 273, 292, 305, 363, 365, 379, 398, 413, 437, 459,
            474, 487, 495, 506, 600, 609, 625, 636, 651, 676, 688, 704,
            716, 721, 749, 767, 768, 800, 810, 819, 851, 862, 872, 893,
            1009, 1032, 1059, 1095, 1108, 1133, 1142, 1162, 1176, 1186,
            1190, 1202, 1209, 1215, 1233, 1246, 1248, 1252, 1312];

        return array.filter(function(element) {
            return allowed.indexOf(element.id) != -1;
        });
    }
}
