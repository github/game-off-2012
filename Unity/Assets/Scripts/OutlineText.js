#pragma strict

private var initialState: GameObject;
private var initialized: boolean = false;
private var outlineWidth: float = 3;
var forbiddenComponents: String[];
function Start () {
	
}

function initialize() {
	var outlineWidthSqrt: float = Mathf.Sqrt(outlineWidth);
	initialState = Instantiate(this.gameObject, Vector3(0, 0, 0), Quaternion.identity);
	cloneGUI(Color.black, Vector3(outlineWidth * 0.001, 0, 0));
	cloneGUI(Color.black, Vector3(-outlineWidth * 0.001, 0, 0));
	cloneGUI(Color.black, Vector3(0, outlineWidth * 0.001, 0));
	cloneGUI(Color.black, Vector3(0, -outlineWidth * 0.001, 0));
	cloneGUI(Color.black, Vector3(outlineWidthSqrt * 0.001, outlineWidthSqrt * 0.001, 0));
	cloneGUI(Color.black, Vector3(-outlineWidthSqrt * 0.001, outlineWidthSqrt * 0.001, 0));
	cloneGUI(Color.black, Vector3(outlineWidthSqrt * 0.001, -outlineWidthSqrt * 0.001, 0));
	cloneGUI(Color.black, Vector3(-outlineWidthSqrt * 0.001, -outlineWidthSqrt * 0.001, 0));
	cloneGUI(Color.white, Vector3(0, 0, 0));
	GameObject.Destroy(initialState);
	initialized = true;
}

function cloneGUI(color: Color, position: Vector3) {
	var obj: GameObject = Instantiate(initialState, Vector3(0, 0, 0), Quaternion.identity);
	obj.guiText.material.color = Color.black;
	Destroy(obj.GetComponent('OutlineText'));
	for (var i: int = 0; i < forbiddenComponents.length; i++) {
		Destroy(obj.GetComponent(forbiddenComponents[i]));
	}
	obj.transform.parent = transform;
	obj.transform.localPosition = position;
}

function OnGUI () {
	if (!initialized) {
		initialize();
	}
	for (var child : Transform in transform) {
	    child.guiText.text = guiText.text;
	}
}