#pragma strict

var rotate: boolean = false;

private var initialScale: float = 1;
private var scale:float = 1;
private var shrunkTotalLength:float = 0.4;
private var shrunkState: float;
private var deleting:boolean = false;
private var speed:Vector2;
private var sprite: OTSprite;
private var rotationSpeed: float;

function Start () {
	sprite = this.GetComponent('OTSprite') as OTSprite;
	scale = Random.value * 0.5 + 0.8;
	initialScale = scale;
	this.transform.localScale = Vector3(scale, scale, 1);
	shrunkState = shrunkTotalLength;
	if (rotate) {
		rotationSpeed = Random.Range(-360, 360);
	}
}

function Update () {
	if (scale > 0) {
		shrunkState -= Time.deltaTime;
		scale = shrunkState * initialScale / shrunkTotalLength;
		this.transform.localScale = Vector3(scale, scale, 1);
		sprite.position += speed * Time.deltaTime;
		if (rotate) {
			sprite.rotation += rotationSpeed * Time.deltaTime;
		}
	} else if (!deleting) {
		GameObject.Destroy(this.gameObject);
		deleting = true;
	}
}

function setSpeed(speedVect: Vector2) {
	speed = speedVect;
}

function getScale() {
	return scale;
}