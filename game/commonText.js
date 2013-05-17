var prefixes = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];
// Adds an SI prefix to the given number. Usefull for displaying
// numbers over a large possible range of values.
function prefixNumber(num, places) {
    if (num < 0) return "-" + prefixNumber(-num, places);

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

    text = text.replace(/([A-Z])/g, " $1");
    text = text.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    return text;
}

//This should be public, it is very conceivable that the needs to layout text
//(for the purposes of measurement, layout or drawing) will be needed by more than
//one person... the assumption that is won't is the root of all text measuring and layout
//problems with windows, and any application which draws and needs to layout text.

//http://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element
//Set font before you call this.
function getWrappedLines(ctx, phrase, maxPxLength) {
    var wa = phrase.split(" "),
        phraseArray = [],
        lastPhrase = wa[0],
        l = maxPxLength,
        measure = 0;

    for (var i = 1; i < wa.length; i++) {
        var w = wa[i];
        measure = ctx.measureText(lastPhrase + w).width;
        if (measure < l) {
            lastPhrase += (" " + w);
        } else {
            phraseArray.push(lastPhrase);
            lastPhrase = w;
        }
        if (i === wa.length - 1) {
            phraseArray.push(lastPhrase);
            break;
        }
    }
    return phraseArray;
};
