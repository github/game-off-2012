#pragma strict

private var nbGroundUnder: int;
private var dieAfter: float = 0.2;
private var noGroundUnderTimer: float;
private var player : Player;
var disabled: boolean;
function Start () {
	disabled = false;
	nbGroundUnder = 0;
	player = this.transform.parent.GetComponent('Player') as Player;
}

function Update () {
	if (!disabled && nbGroundUnder == 0) {
		noGroundUnderTimer += Time.deltaTime;
		if (noGroundUnderTimer > dieAfter) {
			player.noGroundUnder();
			disabled = true;
		}
	}
}

function OnTriggerEnter(other: Collider) {
	if (other.gameObject.CompareTag("Ground")) {
		nbGroundUnder++;
		noGroundUnderTimer = 0;
	}
}

function OnTriggerExit(other: Collider) {
	if (other.gameObject.CompareTag("Ground")) {
		nbGroundUnder--;
		noGroundUnderTimer = 0;
	}
}