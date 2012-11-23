#pragma strict

var goingLeft: boolean = true;
private var fromX: float = 0;
private var toX: float = 0;
private var xProgress: float = 0;
private var featureListObject: GameObject;
private var featureInfos: FeaturesInformations;
private var isMoving: boolean = false;
private var features: String[] = ['clones', 'time_machine', 'extra_jumps', 'magnet'];
function Start () {
	featureListObject = GameObject.Find('features_list');
	featureInfos = GameObject.Find('features_infos').GetComponent('FeaturesInformations') as FeaturesInformations;
}

function Update () {
	if (goingLeft) {
		this.renderer.enabled = featureListObject.transform.position.x < -5;
	} else {
		this.renderer.enabled = featureListObject.transform.position.x > -55;
	}
	this.collider.enabled = this.renderer.enabled;
	if (isMoving) {
		xProgress += Time.deltaTime * 2;
		if (xProgress > 1) {
			isMoving = false;
			xProgress = 1;
			featureInfos.show();
			featureInfos.selectFeature(features[-toX / 20]);
		}
		var xProgressCurve = curve(xProgress);
		featureListObject.transform.position.x = xProgressCurve * toX + (1 - xProgressCurve) * fromX;
	}
}

function curve(xProgress: float) : float {
	if (xProgress < 0.5) {
		return 2 * xProgress * xProgress;
	} else {
		return 1 - 2 * (1 - xProgress) * (1 - xProgress);
	}
}

function OnMouseUp () {
	if (!isMoving) {
		featureInfos.hide();
		fromX = featureListObject.transform.position.x;
		toX = featureListObject.transform.position.x + (goingLeft ? 20 : -20);
		xProgress = 0;
		if (toX < -60) {
			toX = -60;
		}
		if (toX > 0) {
			toX = 0;
		}
		isMoving = true;
	}
}