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

function formatToDisplay(text) {
    if (typeof text != "string")
        fail("Only pass us text!");
    // Transforms "fooBar" to "Foo Bar"
    // http://stackoverflow.com/questions/5796383/insert-spaces-between-words-on-a-camel-cased-token
    text = text.replace(/([A-Z])/g, " $1");
    text = text.charAt(0).toUpperCase() + text.substr(1);
    return text;
}