#pragma strict

private var ingameMenu: GameObject;
function Start () {
	ingameMenu = GameObject.Find('IngameMenu');
}

function OnMouseDown () {
	Time.timeScale = 0;
	ingameMenu.transform.localScale = Vector3(1, 1, 1);
}