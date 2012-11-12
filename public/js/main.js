var canvas = document.getElementById("canv")
var keyListeners = []
var keyState = {};
var keyMap = {
	13 : 'enter',
	37 : 'left',
	38 : 'up',
	39 : 'right',
	40 : 'down',
	186 : ';'
};

function init() {
	keyListeners = []
	canvas.width = 800
	canvas.height = 600
	game = new Game(canvas)
	var player = new Player(game, null, null, game.speed)
	var spawner = new BlockSpawner(game, game.speed / 2)
	var hud = new HUD(game)
	game.addObject("spawner",spawner)
	game.addObject("player",player)
	game.addObject("hud", hud)
	game.update()
}

window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(/* function */callback, /* DOMElement */element) {
		window.setTimeout(callback, 1000 / 60)
	}

})()
window.onkeydown = function(e) {
	try {
		keyState[keyMap[e.which] || String.fromCharCode(e.which)] = e.which;
	} catch(e) {
		console.log('error converting keypress to char code')
	}
}
window.onkeyup = function(e) {
	try {
		delete keyState[keyMap[e.which] || String.fromCharCode(e.which)];
	} catch(e) {
		console.log('error deleting keypress to char code')
	}
}
window.onkeypress = function(e) {
	for (var i = 0; i < keyListeners.length; i++) {
		var k = keyMap[e.which] || String.fromCharCode(e.which)
		if (keyListeners[i][0] == k) {
			e.preventDefault()
			keyListeners[i][1]();
		}
	}
}
init(); 