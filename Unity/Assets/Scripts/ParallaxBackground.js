#pragma strict

var movingCamera: GameObject;
private var parallaxFactor : float = 0.6;
private var width: float;
private var height: float;
function Start () {
	var rayTopLeft : Ray = Camera.main.ScreenPointToRay(Vector2(0, 0));
	var rayBottomRight : Ray = Camera.main.ScreenPointToRay(OT.view.pixelPerfectResolution);
	
	width = rayBottomRight.origin.x - rayTopLeft.origin.x;
	height = rayBottomRight.origin.y - rayTopLeft.origin.y;
}

function Update () {
	this.transform.position = Vector3(OT.view.position.x * parallaxFactor, OT.view.position.y * parallaxFactor, 0);
	
	for (var child : Transform in transform) {
		var isOnLeft : boolean = (child.position.x + child.localScale.x / 2) < (OT.view.position.x - width / 2);
		var isOnRight : boolean = (child.position.x - child.localScale.x / 2) > (OT.view.position.x + width / 2);
		var isOnBottom : boolean = (child.position.y + child.localScale.y / 2) < (OT.view.position.y - height / 2);
		var isOnTop : boolean = (child.position.y - child.localScale.y / 2) > (OT.view.position.y + height / 2);
	
		if (!isOnLeft || !isOnRight) {
			if (isOnLeft) {
				child.position.x += child.localScale.x * 2;
			}
			if (isOnRight) {
				child.position.x -= child.localScale.x * 2;
			}
		}
		if (!isOnBottom || !isOnTop) {
			if (isOnBottom) {
				child.position.y += child.localScale.y * 2;
			}
			if (isOnTop) {
				child.position.y -= child.localScale.y * 2;
			}
		}
	}
}