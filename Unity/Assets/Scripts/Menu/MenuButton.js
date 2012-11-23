#pragma strict

private var originalScale: Vector3;
var playSound: boolean = true;
function Start () {
	originalScale = this.transform.localScale;
	this.transform.localScale *= 0.9;
}

function OnMouseEnter () {
	this.transform.localScale = originalScale;
}

function OnMouseExit () {
	this.transform.localScale = originalScale * 0.9;
}

function OnMouseDown () {
	if (playSound) {
		new OTSound('N4');
	}
	this.transform.localScale = originalScale * 0.8;
}

function OnMouseUp () {
	this.transform.localScale = originalScale * 0.9;
}