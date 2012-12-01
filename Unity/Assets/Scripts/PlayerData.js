#pragma strict
class PlayerData {
	static var coins: int = 0;
	static var stargazers: int = 0;
	static var totalCoins: int = 0;
	
	static var bonusClones: int = 3;
	static var bonusTimeSlowDown: int = 3;
	static var bonusJumps: int = 3;
	static var bonusMagnet: int = 3;
	
	static function addCoin() {
		coins++;
	}
	
	static function addStargazer() {
		stargazers++;
	}
	
	static function getCoins() {
		return coins;
	}
	
	static function getTotalCoins() {
		return totalCoins + coins;
	}
	
	static function getStargazers() {
		return stargazers;
	}
	
	static function gameover() {
		totalCoins += coins;
		coins = 0;
		stargazers = 0;
		saveState();
	}
	
	static function isMagnet() {
		return bonusMagnet > 0;
	}
	
	static function magnetSize() : float {
		return 1 + bonusMagnet * bonusMagnet;
	}
	
	static function canSlowDownTime() : boolean {
		return bonusTimeSlowDown > 0;
	}
	
	static function getSlowDownTime() : float {
		return bonusTimeSlowDown * 2;
	}
	
	static function getSlowDownIntervalTime() : float {
		return 30;
	}
	
	static function getNbBonusJumps() : int {
		return bonusJumps;
	}
	
	static function getNbBonusClones() : int {
		return bonusClones;
	}
	
	static function getLevel(name: String) {
		if (name == 'clones') {
			return bonusClones;
		} else if (name == 'time_machine') {
			return bonusTimeSlowDown;
		} else if (name == 'extra_jumps') {
			return bonusJumps;
		} else {
			return bonusMagnet;
		}
	}
	
	static function upgrade(name: String) {
		if (name == 'clones') {
			bonusClones++;
		} else if (name == 'time_machine') {
			bonusTimeSlowDown++;
		} else if (name == 'extra_jumps') {
			bonusJumps++;
		} else {
			bonusMagnet++;
		}
		saveState();
	}
	
	static function pay(cost: int) {
		totalCoins -= cost;
	}
	
	static function saveState() {
		PlayerPrefs.SetInt("totalCoins", totalCoins);
		PlayerPrefs.SetInt("bonusClones", bonusClones);
		PlayerPrefs.SetInt("bonusTimeSlowDown", bonusTimeSlowDown);
		PlayerPrefs.SetInt("bonusJumps", bonusJumps);
		PlayerPrefs.SetInt("bonusMagnet", bonusMagnet);
	}
	
	static function loadState() {
		totalCoins = PlayerPrefs.GetInt("totalCoins");
		bonusClones = PlayerPrefs.GetInt("bonusClones");
		bonusTimeSlowDown = PlayerPrefs.GetInt("bonusTimeSlowDown");
		bonusJumps = PlayerPrefs.GetInt("bonusJumps");
		bonusMagnet = PlayerPrefs.GetInt("bonusMagnet");
	}
	
}