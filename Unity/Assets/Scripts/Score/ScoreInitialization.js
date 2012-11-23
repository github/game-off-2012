#pragma strict

function Start () {
	GameObject.Find('nbcommits').guiText.text = PlayerData.getCoins() + (PlayerData.getCoins() > 1 ? " commits" : " commit") + " (total is now: " + PlayerData.getTotalCoins() + ")";
	GameObject.Find('nbstargazers').guiText.text = PlayerData.getStargazers() + (PlayerData.getStargazers() > 1 ? " stargazers" : " stargazer");
	
	var www : WWW = new WWW ('http://ns353534.ovh.net/hotfixscore/score.php?score=' + PlayerData.getStargazers());

    // Wait for download to complete
    yield www;
    var scores: String[] = www.text.Split(':'[0]);
    
    GameObject.Find('ranking24').guiText.text = scores[0];
    GameObject.Find('rankingOverall').guiText.text = scores[1];
    
    PlayerData.gameover();
}