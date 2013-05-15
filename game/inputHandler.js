function InputHandler() {
    var self = this;

    //Only valid when handling mouse events (just check when it is set)
    self.ctrlKey = false;

    //Put yourself in here (index global id) to get global mouse moves
    self.globalMouseMove = {};
    self.globalMouseDown = {};
    self.globalMouseUp = {};
    self.globalMouseClick = {};

    //The only reason this would be false is if multiple people are sharing the input handler
    var consumeEvents = true;

    var mouseX = -1;
    var mouseY = -1;
    var mouseDownX = -1;
    var mouseDownY = -1;
    var mouseUpX = -1;
    var mouseUpY = -1;

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
        mouseX = pos.x;
        mouseY = pos.y;
    };

    events.pointerDown = function (e) {
        var pos = pointerCoords(e);
        mouseDownX = pos.x;
        mouseDownY = pos.y;
    };

    events.pointerEnd = function (e) {
        var pos = pointerCoords(e);
        mouseUpX = pos.x;
        mouseUpY = pos.y;
    };

    self.unBind = function (canvas) {
        window.onresize = null;

        canvas.ontouchstart = null;
        canvas.ontouchmove = null;
        canvas.ontouchend = null;
        canvas.ontouchcancel = null;

        canvas.onmousedown = null;
        canvas.onmousemove = null;
        canvas.onmouseup = null;
        canvas.onmouseout = null;
    }

    self.bind = function (newCanvas) {
        canvas = newCanvas;
        window.onresize = events.resize;
        if ('ontouchstart' in canvas) {
            canvas.ontouchstart = events.pointerDown;
            canvas.ontouchmove = events.pointerMove;
            canvas.ontouchend = events.pointerEnd;
            canvas.ontouchcancel = events.pointerEnd;
        } else {
            canvas.onmousedown = events.pointerDown;
            canvas.onmousemove = events.pointerMove;
            canvas.onmouseup = events.pointerEnd;
            canvas.onmouseout = events.pointerEnd;
        }
    };

    function throwMouseEventAt(x, y, eventName, eng, ignore, ctrlKey) {
        var allUnderMouse = [];

        for (var type in eng.base.allChildren) {
            mergeToArray(findAllWithin(eng, type, { x: x, y: y }, 0), allUnderMouse);
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
                    allUnderMouse[key].base.callRaise(eventName, { x: x, y: y, topMost: false, ctrlKey: ctrlKey });

        topMost.base.callRaise(eventName, { x: x, y: y, topMost: true, ctrlKey: ctrlKey });

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

            if (consumeEvents)
                self.resizeEvent = null;
        }
    };

    //Called in update and uses async flags set when we get events
    self.handleMouseEvents = function (eng) {
        if (mouseDownX > 0 && mouseDownY > 0) {
            for (var key in self.globalMouseDown) {
                if (self.globalMouseDown[key].base.rootNode != eng)
                    delete self.globalMouseDown[key];
                else
                    self.globalMouseDown[key].base.callRaise("mousedown", { x: mouseDownX, y: mouseDownY });
            }

            var curMouseDown = throwMouseEventAt(mouseDownX, mouseDownY, "mousedown", eng, self.globalMouseDown, self.ctrlKey);
            self.prevMouseDown = curMouseDown;

            if (consumeEvents) {
                mouseDownX = -1;
                mouseDownY = -1;
            }
        //We delay the mouse up for one cycle to prevent some bugs
        } else if (mouseUpX > 0 && mouseUpY > 0) {
            for (var key in self.globalMouseUp) {
                if (self.globalMouseUp[key].base.rootNode != eng)
                    delete self.globalMouseUp[key];
                else
                    self.globalMouseUp[key].base.callRaise("mouseup", { x: mouseUpX, y: mouseUpY });
            }

            var curMouseUp = throwMouseEventAt(mouseUpX, mouseUpY, "mouseup", eng, self.globalMouseUp, self.ctrlKey);

            if (self.prevMouseDown && self.prevMouseDown.length > 0) {
                for (var key in self.globalMouseClick) {
                    if (self.globalMouseClick[key].base.rootNode != eng)
                        delete self.globalMouseClick[key];
                    else
                        self.globalMouseClick[key].base.callRaise("click", { x: mouseUpX, y: mouseUpY });
                }

                for (var i = 0; i < self.prevMouseDown.length; i++) {
                    if (!self.globalMouseClick[self.prevMouseDown[i].base.id] &&
                        vecToRect({ x: mouseUpX, y: mouseUpY }, self.prevMouseDown[i].tpos).magSq() == 0) {
                        self.prevMouseDown[i].base.callRaise("click", { x: mouseUpX, y: mouseUpY });
                    }
                    self.prevMouseDown[i].base.callRaise("dragEnd", { x: mouseUpX, y: mouseUpY });
                }
            }

            self.prevMouseDown = null;

            if (consumeEvents) {
                mouseUpX = -1;
                mouseUpY = -1;
            }
        }

        if (mouseY > 0 && mouseX > 0) {
            for (var key in self.globalMouseMove) {
                if (self.globalMouseMove[key].base.rootNode != eng)
                    delete self.globalMouseMove[key];
                else
                    self.globalMouseMove[key].base.callRaise("mousemove", { x: mouseX, y: mouseY });
            }

            var curMouseOver = throwMouseEventAt(mouseX, mouseY, "mousemove", eng, self.globalMouseMove);
            //Can actually find mouseout more efficiently... as we have previous and current mousemove...
            if (self.prevMouseOver && self.prevMouseOver.length > 0) {
                for (var i = 0; i < self.prevMouseOver.length; i++) {
                    if (vecToRect({ x: mouseX, y: mouseY }, self.prevMouseOver[i].tpos).magSq() != 0) {
                        self.prevMouseOver[i].base.callRaise("mouseout", { x: mouseX, y: mouseY });
                    }
                }
            }
            self.prevMouseOver = curMouseOver;

            if (self.prevMouseDown && self.prevMouseDown.length > 0) {
                for (var i = 0; i < self.prevMouseDown.length; i++) {
                    self.prevMouseDown[i].base.callRaise("dragged", { x: mouseX, y: mouseY });
                }
            }

            if (consumeEvents) {
                mouseY = -1;
                mouseX = -1;
            }
        }
    }
}
