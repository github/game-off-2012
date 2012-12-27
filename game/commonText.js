var prefixes = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];
// Adds an SI prefix to the given number. Usefull for displaying
// numbers over a large possible range of values.
function prefixNumber(num, places) {
    var pos = Math.floor(Math.log(num) / Math.log(1000));
    if (pos < 0) pos = 0;
    var num = num / Math.pow(1000, pos);
    
    var pre = prefixes[pos];
    if (pre === undefined) pre = "???";

    num = round(num, places);

    return num + pre;
}

// If places is not given, 0 is assumed
function round(num, places) {
    if (isNaN(num)) return 0;
    if (places === undefined) places = 0;
    
    var decimalValue = Math.pow(10, places);
    return Math.round(num * decimalValue) / decimalValue;
}

// Transforms "fooBar" to "Foo Bar"
// Also transforms foo_bar to Foo Bar, since that was
// the original behavior, and we don't have time to
// fix everything.
// http://stackoverflow.com/questions/5796383/insert-spaces-between-words-on-a-camel-cased-token
function formatToDisplay(text) {
    if (!text) return "";

    if (typeof text != "string") {
        fail("Only pass us text!");
    }

    text = text.replace(/_/g, " ");
    text = text.replace(/([A-Z])/g, " $1");
    text = text.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    return text;
}