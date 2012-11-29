//Will crash in debug, for only put an error message in release
function fail(errorMessage) {
    if (DFlag.debug) {
        debugger;
        throw errorMessage ? errorMessage : "error";
    }
    else {
        console.log(errorMessage);
    }
}