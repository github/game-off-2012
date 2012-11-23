#pragma strict

private var features_texts = {};
private var feature_cost: GameObject;
private var feature_state: GameObject;
private var upgrade_button: GameObject;
private var upgrade_disabled: GameObject;
private var coincommit: GameObject;
private var lastFeature: String;
function Start () {
	features_texts['clones'] = ['1 CLONE', '2 CLONES', '3 CLONES'];
	features_texts['time_machine'] = ['2s. each 30s.', '4s. each 30s.', '6s. each 30s.'];
	features_texts['extra_jumps'] = ['1 EXTRA JUMP', '2 EXTRA JUMPS', '3 EXTRA JUMPS'];
	features_texts['magnet'] = ['LOW', 'MEDIUM', 'HIGH'];
	
	feature_cost = this.transform.Find('feature_cost').gameObject;
	feature_state = this.transform.Find('feature_state').gameObject;
	coincommit = this.transform.Find('coincommit').gameObject;
	upgrade_button = this.transform.Find('upgrade').gameObject;
	upgrade_disabled = this.transform.Find('upgrade-disabled').gameObject;
	
	selectFeature('clones');
}

function Update () {

}

function getCostFromLevel(level: int) : int {
	if (level == 0) {
		return 500;
	} else if (level == 1) {
		return 2000;
	} else if (level == 2) {
		return 10000;
	}
	return 0;
}

function selectFeature(name: String) {
	var level: int = PlayerData.getLevel(name);
	var texts: String[] = features_texts[name];
	var cost: int = getCostFromLevel(level);
	var upgrade_button_visible: boolean = false;
	var upgrade_disabled_visible: boolean = false;
	feature_state.guiText.text = level == 0 ? '' : texts[level - 1];
	feature_cost.guiText.text = cost.ToString();
	coincommit.renderer.enabled = true;
	
	upgrade_button_visible = PlayerData.getTotalCoins() >= cost;
	upgrade_disabled_visible = !upgrade_button_visible;
	
	if (level == 3) {
		upgrade_button_visible = false;
		upgrade_disabled_visible = false;
		coincommit.renderer.enabled = false;
		feature_cost.guiText.text = 'MAXIMUM';
	}
	
	upgrade_button.renderer.enabled = upgrade_button_visible;
	upgrade_button.collider.enabled = upgrade_button_visible;
	upgrade_disabled.renderer.enabled = upgrade_disabled_visible;
	lastFeature = name;
}

function upgrade() {
	var level: int = PlayerData.getLevel(lastFeature);
	var cost: int = getCostFromLevel(level);
	
	if (PlayerData.getTotalCoins() >= cost && level < 3) {
		PlayerData.upgrade(lastFeature);
		PlayerData.pay(cost);
		selectFeature(lastFeature);
	}
}

function hide() {
	changeVisibility(false);
}

function show() {
	changeVisibility(true);
}

function changeVisibility(visible: boolean) {
	for (var child : Transform in transform) {
	    if (child.guiText) {
	    	child.guiText.enabled = visible;
	    	for (var child2 : Transform in child) {
	    		child2.guiText.enabled = visible;
	    	}
	    } else {
	    	child.renderer.enabled = visible;
	    }
	    
	    if (child.collider) {
	    	child.collider.enabled = false;
	    }
	}
}