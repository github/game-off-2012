#pragma strict

private var ingameMenu: GameObject;
function Start () {
	ingameMenu = GameObject.Find('IngameMenu');
}

function OnMouseUp () {
	Time.timeScale = 1;
	ingameMenu.transform.localScale = Vector3(0, 0, 0);
}