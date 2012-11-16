/*============================================================
 TERMS OF USE - EASING EQUATIONS

 Open source under the BSD License.

 Copyright Â© 2001 Robert Penner
 All rights reserved.

 Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 - Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 =============================================================*/
/**@
 * #Tweener
 * @author 	Talita Pagani
 * @category Animation
 *
 * Component to animate 2D properties with easing effects, inspired by Tweener Class for ActionScript/Flash platform (http://code.google.com/p/tweener/).
 * Does not conflict with Tween component.
 */
Crafty.c("Tweener", {
    _tw_numProps: 0,
    _tw_step: null,
    _tw_duration: 50,
    _tw_effect: 'easeOutExpo',
    _tw_onComplete: undefined,
    _tw_onCompleteParams: undefined,
    _tw_transitions: {
        /*
         * Linear tween - no easing
         * t: current time, b: beginning value, c: change in value, d: duration
         */
        linear: function (t, b, c, d) {
            return c * t / d + b;
        },
        /*
         * Quadratic easing: t^2
         * t: current time, b: beginning value, c: change in value, d: duration
         */
        easeInQuad: function (t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOutQuad: function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOutQuad: function (t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t + b;
            }

            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        /*
         * Cubic easing: t^3
         * t: current time, b: beginning value, c: change in value, d: duration
         */
        easeInCubic: function (t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOutCubic: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOutCubic: function (t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t * t + b;
            }

            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        /*
         * Similar to cubic easing
         * t: current time, b: beginning value, c: change in value, d: duration
         */
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOut: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t * t + b;
            }

            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        /*
         * Quartic easing: t^4
         * t: current time, b: beginning value, c: change in value, d: duration
         */
        easeInQuart: function (t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOutQuart: function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOutQuart: function (t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t * t * t + b;
            }

            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        /*
         * Quintic easing: t^5
         * t: current time, b: beginning value, c: change in value, d: duration
         */
        easeInQuint: function (t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOutQuint: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOutQuint: function (t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t * t * t * t + b;
            }

            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        /*
         * Sinusoidal easing: sin(t)
         * t: current time, b: beginning value, c: change in position, d: duration
         */
        easeInSine: function (t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOutSine: function (t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOutSine: function (t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        /*
         * Exponential easing: 2^t
         * t: current time, b: beginning value, c: change in position, d: duration
         */
        easeInExpo: function (t, b, c, d) {
            return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOutExpo: function (t, b, c, d) {
            return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOutExpo: function (t, b, c, d) {
            if (t === 0) { return b; }
            if (t === d) { return b + c; }

            if ((t /= d / 2) < 1) {
                return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            }

            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        /*
         * Circular easing: sqrt(1-t^2)
         * t: current time, b: beginning value, c: change in position, d: duration
         */
        easeInCirc: function (t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOutCirc: function (t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOutCirc: function (t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            }

            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        /*
         * Bounce easing: exponentially decaying parabolic bounce
         * t: current time, b: beginning value, c: change in position, d: duration
         */
        easeInBounce: function (t, b, c, d) {
            return c - this.easeOutBounce(d - t, 0, c, d) + b;
        },
        easeOutBounce: function (t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            }
            else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
            }
            else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
            }
        },
        easeInOutBounce: function (t, b, c, d) {
            if (t < d / 2) {
                return this.easeInBounce(t * 2, 0, c, d) * 0.5 + b;
            }

            return this.easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        },
        /*
         * Elastic easing: exponentially decaying sine wave
         * t: current time, b: beginning value, c: change in value, d: duration, a: amplitude (optional), p:period (optional)
         */
        easeInElastic: function (t, b, c, d, a, p) {
            if (t === 0) { return b; }
            if ((t /= d) === 1) { return b + c; }
            if (!p) { p = d * 0.3; }
            if (!a) { a = 1; }
            var s = 0;

            if (a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }

            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOutElastic: function (t, b, c, d, a, p) {
            if (t === 0) { return b; }
            if ((t /= d) === 1) { return b + c; }
            if (!p) { p = d * 0.3; }
            if (!a) { a = 1; }
            var s = 0;

            if (a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }

            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        },
        easeInOutElastic: function (t, b, c, d, a, p) {
            if (t === 0) { return b; }
            if ((t /= d / 2) === 2) { return b + c; }
            if (!p) { p = d * (0.3 * 1.5); }
            if (!a) { a = 1; }
            var s = 0;

            if (a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }

            if (t < 1) {
                return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            }

            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
        },
        /*
         * Back easing: overshooting cubic easing: (s+1)*t^3 - s*t^2
         * t: current time, b: beginning value, c: change in value, d: duration, s: overshoot amount (optional)
         * s controls the amount of overshoot: higher 's' means greater overshoot
         * s has a default value of 1.70158, which produces an overshoot of 10 percent
         * s==0 produces cubic easing with no overshoot
         */
        easeInBack: function (t, b, c, d, s) {
            if (s == undefined) { s = 1.70158; }

            return c * (t/=d) * t * ((s+1) * t - s) + b;
        },
        easeOutBack: function (t, b, c, d, s) {
            if (s == undefined) { s = 1.70158; }

            return c* ((t = t/d-1) * t * ((s+1) * t + s) + 1) + b;
        },
        easeInOutBack: function (t, b, c, d, s) {
            if (s == undefined) { s = 1.70158; }

            if ((t/=d/2) < 1) {
                return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            }

            return c / 2 * ((t -= 2) * t * (((s *= (1.525))+1) * t + s) + 2) + b;
        }
    },
    init: function () {},
    /**@
     * #.addTween
     * @comp Tweener
     * @sign public this .tween(Object properties[, String transition[, Number duration[, Function onComplete[, Array onCompleteParams]]]])
     * @param properties - Object of 2D properties and what they should animate to
     * @param transition - Easing effect to be applied to the animation based on Robert Penner's easing equations
     * @param duration - Duration to animate the properties over (in frames)
     * @param onComplete - Callback function to be executed after tween is finished
     * @param onCompleteParams - Comma-delimited array of params to be executed by the callback function
     *
     * This method will animate a 2D entities properties over the specified duration.
     * These include `x`, `y`, `w`, `h`, `alpha` and `rotation`. It's also possible to set multiple tweens.
     *
     * The object passed should have the properties as keys and the value should be the resulting
     * values of the properties.
     *
     * The available easing transitions are:
     * - Linear (`linear`)
     * - Quadratic (`easeInQuad`, `easeOutQuad`, `easeInOutQuad`)
     * - Cubic (`easeInCubic`, `easeOutCubic`, `easeInOutCubic`)
     * - Quartic (`easeInQuart`, `easeOutQuart`, `easeInOutQuart`)
     * - Quintic (`easeInQuint`, `easeOutQuint`, `easeInOutQuint`)
     * - Sinusoidal (`easeInSine`, `easeOutSine`, `easeInOutSine`)
     * - Exponential (`easeInExpo`, `easeOutExpo`, `easeInOutExpo`)
     * - Circular (`easeInCirc`, `easeOutCirc`, `easeInOutCirc`)
     * - Elastic (`easeInElastic`, `easeOutElastic`, `easeInOutElastic`)
     * - Back (`easeInBack`, `easeOutBack`, `easeInOutBack`)
     * - Bounce (`easeInBounce`, `easeOutBounce`, `easeInOutBounce`)
     *
     * @example
     * Move an object to 100,100 with bounce transition in 200 frames.
     * ~~~
     * Crafty.e("2D, Tweener")
     *    .attr({x: 0, y: 0})
     *    .addTween({x: 100, y: 100}, 'easeOutBounce', 200)
     * ~~~
     * Move an object to 650 on x-axis and 1080 degrees on rotation with quadratic transition in 100 frames and
     * 500 on y-axis with bounce transition in 200 frames.
     * ~~~
     * Crafty.e("2D, Tweener")
     *    .attr({x: 10, y: 75})
     *    .addTween({x:650, rotation: 1080}, 'easeInQuad',100);
     *    .addTween({y:500}, 'easeOutBounce',200);
     * ~~~
     * Passing a callback function to be executed on tween end
     * ~~~
     * Crafty.e("2D, Tweener")
     *    .attr({x: 0, y: 0})
     *    .addTween({x: 100, y: 100}, 'easeOutBounce', 200, func)
     *
     * Crafty.e("2D, Tweener")
     *    .attr({x: 50, y: 50})
     *    .addTween({x: 150, y: 150}, 'easeOutBounce', 300, func, ["Passing parameters to callback!"])
     *
     * function func(message) {
	* 	if (message != undefined) {
	*	 	alert(message);
	*   } else {
	*	 	alert("Callback function without parameters");
	*   }
	* }
     * ~~~
     */
    addTween: function(props, transition, duration, onComplete, onCompleteParams) {
        this.each(function () {
            if (this._tw_step == null) {
                this._tw_step = {};
                this.bind('EnterFrame', tweenerEnterFrame);
                this.bind('RemoveComponent', function (c) {
                    if (c == 'Tweener') {
                        this.unbind('EnterFrame', tweenerEnterFrame);
                    }
                });
            }

            for (var prop in props) {
                /*
                 * Properties:
                 * b	Begin	 Initial position
                 * c	Change	 Final position-Initial position
                 * d	Duration Animation duration in frames (default FPS is usually 50 on Crafty)
                 * f 	Final	 Final position
                 * t	Time	 Time counter
                 * e	Effect	 Transition of the property (in case of multiple tweens)
                 */
                this._tw_step[prop] = { b: this[prop], c: (props[prop] - this[prop]), d: duration || this._tw_duration, f: props[prop], t: 0, e: transition || this._tw_effect };
                this._tw_numProps++;
            }

            this._tw_onComplete = onComplete || undefined;

            this._tw_onCompleteParams = onCompleteParams || undefined;
        });
        return this;
    }
});

function tweenerEnterFrame(e) {
    if (this._tw_numProps <= 0) {
        this.trigger("EndTween");
        if(typeof this._tw_onComplete === 'function') {
            if(this._tw_onCompleteParams) {
                this._tw_onComplete.apply(this, this._tw_onCompleteParams);
            } else {
                this._tw_onComplete();
            }
        }
        return;
    }

    var prop, k;
    /* For each property of the entity, calculate its new value based on the transition equation specified */
    for (k in this._tw_step) {
        prop = this._tw_step[k];
        this[k] = this._tw_transitions[prop.e](prop.t++, prop.b, prop.c, prop.d);
        // stop tween on property
        if(prop.t == prop.d) {
            // decimal numbers rounding fix
            this[k] = prop.f;
            if (prop.t >= prop.d) {
                delete this._tw_step[k];
            }
            this._tw_numProps--;
        }
    }
}