var canvas = document.getElementById("canv")
var selecting=false
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
	if(localStorage.soundSettings && localStorage.soundSettings=="off")
		turnOffSound()
	keyListeners = []
	canvas.width = 800
	canvas.height = 600
	game = new Game(canvas)
	global_controls = new Controls()
	var hud = new HUD(game, true)
	game.addObject("hud", hud)
	hud.draw(game.ctx)
}

function startGame() {
	keyListeners = []
	game.play = false
	game = new Game(canvas)
	player = new Player(game, null, null, null, game.speed)
	spawner = new BlockSpawner(game, game.speed)
	hud = new HUD(game)
	power_spawner = new PowerupSpawner(game)
	game.addObject("spawner", spawner)
	game.addObject("player", player)
	game.addObject("power_spawn", power_spawner)
	game.addObject("hud", hud)
	game.update()
}

function toggleSound(){
	var button = document.getElementById("mute")
	var audio = document.getElementById("bgaudio")
	if(button.className.indexOf("up")!=-1){//need to mute
		button.className = button.className.replace("up","off")
		audio.pause()
		localStorage.soundSettings="off"
	}
	else{//turn back on
		button.className = button.className.replace("off","up")
		audio.play()
		localStorage.soundSettings="on"
	}
}

function turnOffSound(){
	var button = document.getElementById("mute")
	if(button.className.indexOf("up")!=-1){//need to mute
		toggleSound()
	}
}
function turnOnSound(){
	var button = document.getElementById("mute")
	if(button.className.indexOf("off")!=-1){//need to start
		toggleSound()
	}
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
		if (keyListeners[i][0] === k) {
			e.preventDefault()
			keyListeners[i][1]();
		}
	}
}
init();
