#pragma strict

private var isJumping: boolean;
private var playerObject: GameObject;
private var player:Player;
function Start () {
	isJumping = false;
	playerObject = GameObject.Find("player");
	player = playerObject.GetComponent("Player") as Player;
}

function Update () {
	if (Input.GetKeyDown ("space") || Input.GetMouseButtonDown(0)) {
		if (!isJumping) {
        	player.triggerJump();
        }
        isJumping = true;
	}
	if (Input.GetKeyUp ("space") || Input.GetMouseButtonUp(0)) {
		if (isJumping) {
        	player.triggerStopJump();
        }
        isJumping = false;
	}
	
	if (Input.GetKeyUp ("s") || Input.GetMouseButtonUp(1)) {
		player.triggerSlowDown();
	}
}