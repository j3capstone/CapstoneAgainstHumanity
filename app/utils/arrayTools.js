module.exports = {
    /* A bunch of functions that I wrote to handle array weirdness. */
    /* Felt like they would serve better inside their own utility object, so here they are! */
    ObjectToArray: function (object) {
        return Object.keys(object).map(function(key) { return object[key] });
    },
    /* I had the need to clone an array as to not modify the original */
    /* Mainly to clone the master list of cards before shuffling and drawing cards for individual games */
    Clone: function (array) {
        return array.splice(0);
    },
    /* Some fancy shuffle that I rewrote from Stack Overflow */
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
    /* ...This game has some inappropriate cards. This filters some of the worst ones out. */
    /* ...Since there are so many cards and so many are inappropriate, we opted to filter by acceptable choices instead of unacceptable. */
    Filter: function (array) {
        /* Filter to a select few somewhat more class-appropriate cards */
        var allowed = [18, 26, 43, 47, 83, 95, 111, 143, 174, 190, 193,
            201, 239, 273, 292, 305, 363, 365, 379, 398, 413, 437, 459,
            460, 462, 463, 464, 465, 468, 470, 472, 474, 476, 478, 481,
            484, 485, 487, 493, 494, 495, 497, 502, 504, 506, 507, 513,
            516, 517, 554, 557, 558, 572, 600, 609, 625, 630, 633, 636,
            641, 643, 651, 654, 660, 668, 676, 680, 681, 677, 678, 688,
            693, 695, 704, 706, 716, 721, 722, 723, 749, 767, 768, 774,
            779, 785, 792, 800, 810, 819, 829, 831, 839, 851, 862, 872,
            893, 904, 906, 926, 944, 966, 967, 971, 977, 983, 984, 995,
            998, 1003, 1009, 1012, 1015, 1018, 1032, 1044, 1045, 1046,
            1055, 1059, 1067, 1068, 1069, 1081, 1095, 1108, 1112, 1133,
            1141, 1142, 1149, 1152, 1157, 1159, 1162, 1166, 1167, 1176,
            1186, 1190, 1202, 1209, 1215, 1233, 1246, 1248, 1249, 1252,
            1259, 1268, 1271, 1302, 1303, 1305, 1312, 1323, 1324, 1325,
            1326, 1327, 1328, 1330, 1331, 1332, 1333, 1334, 1335, 1336,
            1337, 1338, 1339, 1340, 1341, 1342, 1343, 1344, 1346, 1347,
            1348, 1349, 1350, 1351, 1352, 1353, 1354, 1355, 1361, 1374,
            1378, 1404, 1405, 1406, 1407, 1408, 1418, 1421, 1425, 1430,
            1436, 1460, 1804, 1806, 1813, 1814, 1828, 1829, 1820, 1821];

        return array.filter(function(element) {
            return allowed.indexOf(element.id) != -1;
        });
    }
}
