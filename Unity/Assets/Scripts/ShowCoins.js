#pragma strict


function OnGUI () {
	guiText.text = PlayerData.getCoins().ToString();
}