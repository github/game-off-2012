#pragma strict

function Start () {

}

function OnGUI () {
	guiText.text = PlayerData.getStargazers().ToString();
}