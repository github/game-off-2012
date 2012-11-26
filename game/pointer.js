//Makes a pointer out of basic datatypes, using the fact
//that they reside somewhere!
function Pointer(owner, name) {
    this.owner = owner;
    this.name = name;

    this.getValue = function () {
        return this.owner[this.name];
    }

    this.setValue = function (newValue) {
        this.owner[this.name] = newValue;
    }
}

//Oh boy oh boy... this makes me cry because it is possible to
//take all code which uses "pointers" and have parallel code which uses
//constant values. The constant value code will be much faster and shorter...
//however I want both so I am forcing the constant value code through the pointer
//code, which degrades performance (but I will just blame it on the javascript
//engine for not figuring out what I am doing).
function ConstantPointer(value) {
    this.value = value;

    this.getValue = function () {
        return this.value;
    }

    this.setValue = function (newValue) {
        this.value = newValue;
    }
}

function forcePointer(valuePointer) {
    if (getRealType(valuePointer) != "Pointer")
        return new ConstantPointer(valuePointer);
    else
        return valuePointer;
}