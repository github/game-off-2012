//System to switch between different things being active (like game, menu, etc)
function ScreenSystem(canvasName) {
    this.canvasName = canvasName;


    var canvas = document.getElementById(canvasName.substring(1));

    //Proper resize code is in mainGame.js (but not used)
    canvas.width = DFlag.width;
    canvas.height = DFlag.height;
    
    var pen = canvas.getContext("2d");

    this.screens = {};
    var screens = this.screens;

    var activeScreen = null;

    window.reqAnim = (function () {
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(function () {
                callback(Date.now());
            }, 1000 / 60);
        };
    })();

    this.addScreen = function(screenName, screen) {
        screens[screenName] = screen;
    }

    this.setActiveScreen = function (screenName) {
        if (screens[screenName]) {
            activeScreen = screens[screenName];

            //Set up proper mouse events
            $(this.canvasName).off();

            var events = screens[screenName].input.events;
            for (var eventName in events) {
                events[eventName] = events[eventName].bind(activeScreen.input);
            }

            for (var eventName in events) {
                $(this.canvasName).on(eventName, events[eventName]);
            }
        }
    }
    
    function tick(timestamp) {
        if (activeScreen && activeScreen.run) {
            activeScreen.run(timestamp);
            activeScreen.draw(pen);
        }
        window.reqAnim(tick.bind(this));
    }
    window.reqAnim(tick.bind(this));
}