#pragma strict
private var staticLength: float = 1.5;
private var rollingLength: float = 0.454545; //(10 / 22)
private var decal: float = 0;
private var sprite: OTAnimatingSprite;
private var state: String = "none";
function Start () {
	sprite = this.GetComponent('OTAnimatingSprite');
	decal = -(sprite.position.x * 0.05 + sprite.position.y * 0.05);
}

function Update () {
	var nbCycle: int = Mathf.Floor((Time.time + decal) / (staticLength + rollingLength));
	var newState: String = ((Time.time + decal) - nbCycle * (staticLength + rollingLength)) < staticLength ? 'Static' : 'Rolling';
	
	if (state != newState) {
		state = newState;
		sprite.PlayOnce(state );
	}
}