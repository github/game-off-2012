function assertDefined(functionName) {
    var allDefined = true;

    //if (typeof functionName !== "string") {
      //  fail("First argument to assertDefined must be the name of the function");
    //}

    for(var i = 0; i < arguments.length; i++)
    {
        if (typeof arguments[i] === "undefined") {
            fail("Variable is required but is undefined in " + functionName);
            allDefined = false;
        }
    }

    return allDefined;
}

function defined() {
    for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === "undefined") {
            return false;
        }
    }
    return true;
}

//Well this looks kinda expensive, so try not to use it?
function getRealType(object) {
    //http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript    
    var funcNameRegex = /function (.{1,})\(/;
    var results = (funcNameRegex).exec((object).constructor.toString());
    return (results && results.length > 1) ? results[1] : "";
}

function nullOrUndefined(object) {
    return typeof object === "undefined" || object === null;
}