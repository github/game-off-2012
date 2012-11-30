function Sound(src) {
    if (!DFlag.enableSounds) {
        this.play = function() {};
        return;
    }
    var audio = new Audio(src);
    this.play = function() {
        return audio.play();
    }
}