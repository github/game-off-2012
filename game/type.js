function assertDefined(functionName) {
    var allDefined = true;

    if (typeof functionName !== "string") {
        fail("First argument to assertDefined must be the name of the function");
    }

    for(var i = 1; i < arguments.length; i++)
    {
        if (typeof arguments[i] === "undefined") {
            fail("Variable is required but is undefined");
            allDefined = false;
        }
    }

    return allDefined;
}