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
    if (!text)
        return "";

    if (typeof text != "string")
        fail("Only pass us text!");

    // Transforms "fooBar" to "Foo Bar"
    // Also transforms foo_bar to Foo Bar, since that was
    // the original behavior, and we don't have time to
    // fix everything.
    // http://stackoverflow.com/questions/5796383/insert-spaces-between-words-on-a-camel-cased-token
    text = text.replace(/_/g, " ");
    text = text.replace(/([A-Z])/g, " $1");
    text = text.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    return text;
}

//Well this is all I need to do colors
function setColorPart(color, partNumber, partValue) {
    var functionParts = color.split("(");
    var functionName = functionParts[0];
    var args = functionParts[1].split(")")[0].split(",");

    args[partNumber] = partValue;

    var returnValue = functionName + "( ";

    var first = true;
    for (var key in args) {
        if (first) {
            first = false;
            returnValue += args[key];
        }
        else {
            returnValue += ", " + args[key];
        }
    }
    returnValue += ")";

    return returnValue;
}