#pragma strict
private var sprite:OTSprite;
private var duration: float = 0.2;
private var startingScaleX: float = 0.8;
private var startTime: float;
function Start () {
	sprite = this.GetComponent('OTSprite') as OTSprite;
	var angleRadiant: float = (-Mathf.Atan(0.5) + Random.Range(-0.5, 0.5)) * 180 / Mathf.PI;
	sprite.rotation = angleRadiant;
	startTime = Time.time;
}

function Update () {
	if (Time.time - startTime > duration) {
		GameObject.Destroy(transform.gameObject);
		return;
	}
	transform.localScale.x = (1 - (Time.time - startTime) / duration) * startingScaleX;
}