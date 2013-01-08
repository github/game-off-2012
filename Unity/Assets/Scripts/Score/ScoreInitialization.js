#pragma strict

function Start () {
	GameObject.Find('nbcommits').guiText.text = PlayerData.getCoins() + (PlayerData.getCoins() > 1 ? " commits" : " commit") + " (total is now: " + PlayerData.getTotalCoins() + ")";
	GameObject.Find('nbstargazers').guiText.text = PlayerData.getStargazers() + (PlayerData.getStargazers() > 1 ? " stargazers" : " stargazer");
	
	var stargazers : int = PlayerData.getStargazers();
	
	PlayerData.gameover();
	
	var www : WWW = new WWW ('http://drouyer.com/hotfix/score.php?score=' + stargazers);

    // Wait for download to complete
    yield www;
    var scores: String[] = www.text.Split(':'[0]);
    
    GameObject.Find('ranking24').guiText.text = scores[0];
    GameObject.Find('rankingOverall').guiText.text = scores[1];
}