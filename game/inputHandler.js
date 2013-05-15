function InputHandler() {
    var self = this;

    //Only valid when handling mouse events (just check when it is set)
    self.ctrlKey = false;

    //Put yourself in here (index global id) to get global mouse moves
    self.globalMouseMove = {};
    self.globalMouseDown = {};
    self.globalMouseUp = {};
    self.globalMouseClick = {};

    //The only reason self would be false is if multiple people are sharing the input handler
    self.consumeEvents = true;

    self.mX = -1;
    self.mY = -1;
    self.mdX = -1; //Mouse down
    self.mdY = -1;
    self.muX = -1; //Mouse up
    self.muY = -1;

    self.resizeEvent = null;

    var canvas;

    function pointerCoords(e) {
        var left = canvas.offsetLeft;
        var top = canvas.offsetTop;

        self.ctrlKey = e.ctrlKey;
        e.preventDefault();

        if (e.changedTouches) {
            var touch = e.changedTouches[0];
            return {
                x: touch.pageX - left,
                y: touch.pageY - top,
            };
        } else {
            return {
                x: e.pageX - left,
                y: e.pageY - top,
            };
        }
    }

    var events = {};

    events.resize = function (e) {
        self.resizeEvent = e;
    }

    events.pointerMove = function (e) {
        var pos = pointerCoords(e);
        self.mX = pos.x;
        self.mY = pos.y;
    };

    events.pointerDown = function (e) {
        var pos = pointerCoords(e);
        self.mdX = pos.x;
        self.mdY = pos.y;
    };

    events.pointerEnd = function (e) {
        var pos = pointerCoords(e);
        self.muX = pos.x;
        self.muY = pos.y;
    };

    self.unBind = function (canvas) {
        $(canvas).off();
        $(window).off();
    }

    self.bind = function (newCanvas) {
        canvas = newCanvas;
        window.addEventListener('resize', events.resize, false);
        var touch = isTouchDevice();
        canvas.addEventListener(touch ? 'touchstart' : 'mousedown', events.pointerDown, false);
        canvas.addEventListener(touch ? 'touchmove' : 'mousemove', events.pointerMove, false);
        canvas.addEventListener(touch ? 'touchend' : 'mouseup', events.pointerEnd, false);
        canvas.addEventListener(touch ? 'touchcancel' : 'mouseout', events.pointerEnd, false);
    };

    function throwMouseEventAt(mX, mY, eventName, eng, ignore, ctrlKey) {
        var allUnderMouse = [];

        for (var type in eng.base.allChildren) {
            mergeToArray(findAllWithin(eng, type, { x: mX, y: mY }, 0), allUnderMouse);
        }

        if (allUnderMouse.length == 0)
            return;

        var topMost = allUnderMouse[0];

        if(!ignore)
            ignore = {};

        //*sigh* so inefficient... but for now its fine
        for (var key in allUnderMouse)
            if(!ignore[key])
                if (allUnderMouse[key].base.zindex > topMost.base.zindex ||
                           (allUnderMouse[key].base.zindex == topMost.base.zindex &&
                           allUnderMouse[key].base.zoffset > topMost.base.zoffset)) {
                    if (allUnderMouse[key].base.canHandleEvent(eventName))
                        topMost = allUnderMouse[key];
                }

        for (var key in allUnderMouse)
            if(!ignore[key])
                if (allUnderMouse[key] !== topMost)
                    allUnderMouse[key].base.callRaise(eventName, { x: mX, y: mY, topMost: false, ctrlKey: ctrlKey });

        topMost.base.callRaise(eventName, { x: mX, y: mY, topMost: true, ctrlKey: ctrlKey });

        return allUnderMouse;
    }

    self.handleEvents = function (eng) {
        self.handleMouseEvents(eng);

        if (self.resizeEvent) {
            console.log("self.resizeEvent:", self.resizeEvent);

            var game = eng.game;
            var minWidth = game.numTilesX * game.tileSize + 150;
            var minHeight = game.numTilesY * game.tileSize;
            var width = Math.max(window.innerWidth, minWidth);
            var height = Math.max(window.innerHeight, minHeight);

            self.resizeEvent.width = canvas.width = width;
            self.resizeEvent.height = canvas.height = height;

            eng.base.raiseEvent("globalResize", self.resizeEvent);

            if (self.consumeEvents)
                self.resizeEvent = null;
        }
    };

    //Called in update and uses async flags set when we get events
    self.handleMouseEvents = function (eng) {
        if (self.mdX > 0 && self.mdY > 0) {
            for (var key in self.globalMouseDown) {
                if (self.globalMouseDown[key].base.rootNode != eng)
                    delete self.globalMouseDown[key];
                else
                    self.globalMouseDown[key].base.callRaise("mousedown", { x: self.mdX, y: self.mdY });
            }

            var curMouseDown = throwMouseEventAt(self.mdX, self.mdY, "mousedown", eng, self.globalMouseDown, self.ctrlKey);
            self.prevMouseDown = curMouseDown;

            if (self.consumeEvents) {
                self.mdX = -1;
                self.mdY = -1;
            }
        //We delay the mouse up for one cycle to prevent some bugs
        } else if (self.muX > 0 && self.muY > 0) {
            for (var key in self.globalMouseUp) {
                if (self.globalMouseUp[key].base.rootNode != eng)
                    delete self.globalMouseUp[key];
                else
                    self.globalMouseUp[key].base.callRaise("mouseup", { x: self.muX, y: self.muY });
            }

            var curMouseUp = throwMouseEventAt(self.muX, self.muY, "mouseup", eng, self.globalMouseUp, self.ctrlKey);

            if (self.prevMouseDown && self.prevMouseDown.length > 0) {
                for (var key in self.globalMouseClick) {
                    if (self.globalMouseClick[key].base.rootNode != eng)
                        delete self.globalMouseClick[key];
                    else
                        self.globalMouseClick[key].base.callRaise("click", { x: self.muX, y: self.muY });
                }

                for (var i = 0; i < self.prevMouseDown.length; i++) {
                    if (!self.globalMouseClick[self.prevMouseDown[i].base.id] &&
                        vecToRect({ x: self.muX, y: self.muY }, self.prevMouseDown[i].tpos).magSq() == 0) {
                        self.prevMouseDown[i].base.callRaise("click", { x: self.muX, y: self.muY });
                    }
                    self.prevMouseDown[i].base.callRaise("dragEnd", { x: self.muX, y: self.muY });
                }
            }

            self.prevMouseDown = null;

            if (self.consumeEvents) {
                self.muX = -1;
                self.muY = -1;
            }
        }

        if (self.mY > 0 && self.mX > 0) {
            for (var key in self.globalMouseMove) {
                if (self.globalMouseMove[key].base.rootNode != eng)
                    delete self.globalMouseMove[key];
                else
                    self.globalMouseMove[key].base.callRaise("mousemove", { x: self.mX, y: self.mY });
            }

            var curMouseOver = throwMouseEventAt(self.mX, self.mY, "mousemove", eng, self.globalMouseMove);
            //Can actually find mouseout more efficiently... as we have previous and current mousemove...
            if (self.prevMouseOver && self.prevMouseOver.length > 0) {
                for (var i = 0; i < self.prevMouseOver.length; i++) {
                    if (vecToRect({ x: self.mX, y: self.mY }, self.prevMouseOver[i].tpos).magSq() != 0) {
                        self.prevMouseOver[i].base.callRaise("mouseout", { x: self.mX, y: self.mY });
                    }
                }
            }
            self.prevMouseOver = curMouseOver;

            if (self.prevMouseDown && self.prevMouseDown.length > 0) {
                for (var i = 0; i < self.prevMouseDown.length; i++) {
                    self.prevMouseDown[i].base.callRaise("dragged", { x: self.mX, y: self.mY });
                }
            }

            if (self.consumeEvents) {
                self.mY = -1;
                self.mX = -1;
            }
        }
    }
}
