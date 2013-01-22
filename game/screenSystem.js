 //System to switch between different things being active (like game, menu, etc)
function ScreenSystem(canvas) {
    var pen = canvas.getContext("2d");

    var screens = {};
    var active = null;

    this.addScreen = function (name, screen) {
        screens[name] = screen;
    }

    this.setActiveScreen = function (name) {
        if (active && active.input) {
            active.input.unBind(canvas);
        }
        
        active = screens[name];
        active.screenSystem = this;

        if (active.input) {
            active.input.bind(canvas);
        }

        if (active.gainFocus) active.gainFocus();
    }
    
    var reqAnim = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(cb) {
            window.setTimeout(function() {
                cb();
            }, 1000 / 60);
        };
    })();
    
    function tick() {
        if (active && active.run) {
            active.run(Date.now());
            pen.clearRect(0, 0, canvas.width, canvas.height);
            active.draw(pen);
        }
        reqAnim(tick.bind(this));
    }
    reqAnim(tick.bind(this));
}