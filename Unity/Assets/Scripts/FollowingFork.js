#pragma strict
private var player: OTAnimatingSprite;
private var sprite: OTSprite;

private var currentAngle: float; 
private var speed: float = 3.5;
private var refreshAngleUntil: float = 1;
private var refreshAngleSince: float = 0;
private var wasRefreshingAngle: boolean = true;
private var maxDistance: float = 10;
private var distanceCovered: float = 0;
private var isAutoDestroying: boolean = false;
private var isAutoDestroyingSince: float = 0;
private var isAutoDestroyingUntil: float = 1.5;
private var originalSpeedWhenAutoDestroying: float;
private var randomAngleDecal: float;
private var angleVariation: float = 0.35;
function Start () {
	randomAngleDecal = Random.Range(0, 10);
	player = GameObject.Find('player').GetComponent('OTAnimatingSprite') as OTAnimatingSprite;
	sprite = this.GetComponent('OTSprite') as OTSprite;
	refreshAngle();
}

function Update () {
	refreshAngleSince += Time.deltaTime;
	if (refreshAngleSince < refreshAngleUntil) {
		refreshAngle();
	} else {
		if (wasRefreshingAngle) {
			currentAngle += Random.Range(-angleVariation / 2.0f, angleVariation / 2.0f);
			wasRefreshingAngle = false;
			speed *= 2;
		}
	}
	sprite.position += Vector2(Mathf.Cos(currentAngle), Mathf.Sin(currentAngle)) * speed * Time.deltaTime;
	distanceCovered += speed * Time.deltaTime;
	if (!isAutoDestroying && distanceCovered > maxDistance) {
		this.collider.enabled = false;
		isAutoDestroying = true;
		originalSpeedWhenAutoDestroying = speed;
	}
	if (isAutoDestroying) {
		isAutoDestroyingSince += Time.deltaTime;
		var delta: float = 1 - (isAutoDestroyingSince / isAutoDestroyingUntil);
		sprite.alpha = delta;
		speed = originalSpeedWhenAutoDestroying * delta;
		if (isAutoDestroyingSince > isAutoDestroyingUntil) {
			GameObject.Destroy(this.gameObject);
		}
	}
}

function refreshAngle() {
	currentAngle = Mathf.Atan2(player.position.y - sprite.position.y, player.position.x - sprite.position.x) + Mathf.Cos((Time.time + randomAngleDecal) * 20) * angleVariation;
	sprite.rotation = (currentAngle * 360 / (2 * Mathf.PI)) - 90;
}

function OnTriggerEnter(other: Collider) {
	if (other.gameObject.CompareTag("Player")) {
		GameObject.Destroy(this.gameObject);
	}
}