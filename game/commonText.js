var prefixes = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];
//Prefixes the number with prefixes to reduce its size
function prefixNumber(number, decimalPlaces) {
    //Math.floor(Math.log(val) / Math.log(1000))
    //will also get "pos"
    var pos = 0;
    while (number > 1000) {
        number = number / 1000;
        pos++;
    }
    var pre = prefixes[pos];
    if (pre == undefined) pre = "???";

    if (defined(decimalPlaces))
        number = roundToDecimal(number, decimalPlaces);

    return number + pre;
}

var decimalTable = { 0: 1, 1: 10, 2: 100, 3: 1000, 4: 10000, 5: 100000, 6: 1000000 };
function roundToDecimal(value, decimalPlaces) {
    var decimalValue;
    if (decimalPlaces <= 6) {
        decimalValue = decimalTable[decimalPlaces]
    } else {
        decimalValue = 1;
        while (decimalPlaces > 0)
            decimalValue *= 10;
    }
    return Math.round(value * decimalValue) / decimalValue;
}

function underscoresToSpaces(text) {
    if (typeof text != "string")
        fail("Only pass us text!");
    return text.replace(/_/g, " ");
}

//http://stackoverflow.com/questions/4878756/javascript-how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
function capitalizeWords(text) {
    return text.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

function formatToDisplay(text) {
    return capitalizeWords(underscoresToSpaces(text));
}