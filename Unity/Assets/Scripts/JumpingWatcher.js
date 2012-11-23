#pragma strict

private var state: String = 'bottom';
private var onBottomTime: float = 0;
private var onBottomUntil: float = 3.0f / 16.0f;
private var jumpingStrength: float = 7;
private var sprite: OTAnimatingSprite;
private var ySpeed: float = 0;
private var xSpeed: float = 2;
private var originPosition: Vector2;
private var fallAcceleration:float = 20;
private var goingLeft: boolean = true;
private var fromX: float = -5;
private var toX: float = 5;
private var initialized: boolean = false;
private var player: OTAnimatingSprite;

function Start () {
	player = GameObject.Find('player').GetComponent('OTAnimatingSprite');
}

function Update () {
	if (initialized) {
		processJump();
		processSpeed();
	}
}

function processJump() {
	if (state == 'bottom') {
		onBottomTime += Time.deltaTime;
		if (onBottomTime > onBottomUntil) {
			var volume: float = Mathf.Max(0, (50.0 - Vector2.Distance(player.position, sprite.position)) / 50.0);
			new OTSound('Flick').Volume(0.6 * volume);
			//Debug.Log('up');
			ySpeed = jumpingStrength;
			state = 'up';
		}
	}
	
	if (state != 'bottom') {
		ySpeed -= fallAcceleration * Time.deltaTime;
		if (ySpeed > 1) {
			playSprite('Going up');
		} else if (ySpeed < -1) {
			playSprite('Going down');
		} else {
			playSprite('On top');
		}
		sprite.position.y += ySpeed * Time.deltaTime;
		if (sprite.position.y < originPosition.y) {
			ySpeed = 0;
			state = 'bottom';
			playSprite('Landing');
			onBottomTime = 0;
			sprite.position.y = originPosition.y;
		}
	}
}

function playSprite(name: String) {
	sprite.PlayOnce(name + ' ' + (goingLeft ? 'LEFT' : 'RIGHT'));
}

function processSpeed() {
	if (state != 'bottom') {
		sprite.position.x += (goingLeft ? -1 : 1) * xSpeed * Time.deltaTime;
		if (sprite.position.x < fromX) {
			goingLeft = false;
		}
		if (sprite.position.x > toX) {
			goingLeft = true;
		}
	}
}

function setRandomPosition() {
	sprite.position.x = Random.Range(fromX, toX);
	goingLeft = Random.Range(0, 1) > 0.5;
}

function initialize(x1: float, x2: float) {
	fromX = x1;
	toX = x2;
	sprite = this.GetComponent('OTAnimatingSprite') as OTAnimatingSprite;
	playSprite('Landing');
	originPosition = sprite.position;
	setRandomPosition();
	Update();
	this.renderer.enabled = true;
	initialized = true;
}