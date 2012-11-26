var prefixes = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];
//Prefixes the number with prefixes to reduce its size
function prefixNumber(number) {
    //Math.floor(Math.log(val) / Math.log(1000))
    //will also get "pos"
    var pos = 0;
    while (number > 1000) {
        number = number / 1000;
        pos++;
    }
    var pre = prefixes[pos];
    if (pre == undefined) pre = "???";

    return pre + number;
}

function underscoresToSpaces(text) {
    return text.replace("_", " ");
}

//http://stackoverflow.com/questions/4878756/javascript-how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
function capitalizeWords(text) {
    return text.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

function formatToDisplay(text) {
    return capitalizeWords(underscoresToSpaces(text));
}