 //System to switch between different things being active (like game, menu, etc)

function ScreenSystem(canvas) {
    //Proper resize code is in mainGame.js (well really inputHandler.js) (but not used)
    canvas.width = DFlag.width;
    canvas.height = DFlag.height;

    var pen = canvas.getContext("2d");

    var screens = {};
    var activeScreen = null;

    this.addScreen = function(name, screen) {
        screens[name] = screen;
    }

    this.setActiveScreen = function(name) {
        if (!screens[name]) return;
        
        activeScreen = screens[name];
        activeScreen.screenSystem = this;

        $(canvas).off();

        if (screens[name].input) {
            bindInput(screens[name].input);
        }

        if (activeScreen.gainFocus) activeScreen.gainFocus();
    }

    function bindInput(input) {
        if (!input) return;
        
        var events = input.events;
        for (var eventName in events) {
            // Preserve this context
            events[eventName] = events[eventName].bind(input);
        }

        for (var eventName in events) {
            $(canvas).on(eventName, events[eventName]);
        }
    };
    
    var reqAnim = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(cb) {
            window.setTimeout(function() {
                cb(Date.now());
            }, 1000 / 60);
        };
    })();
    
    function tick(timestamp) {
        if (activeScreen && activeScreen.run) {
            activeScreen.run(timestamp);
            activeScreen.draw(pen);
        }
        reqAnim(tick.bind(this));
    }
    reqAnim(tick.bind(this));
}