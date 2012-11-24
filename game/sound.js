function Sound(src) {
    if (DFlag.disableSounds) {
        this.play = function() {};
        return;
    }
    var audio = new Audio(src);
    this.play = function() {
        return audio.play();
    }
}