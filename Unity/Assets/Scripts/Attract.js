#pragma strict

private var coins = {};
private var intensity: float = 5;
function Start () {
	
}

function Update () {
	var position = Vector2(this.transform.position.x, this.transform.position.y);
	var maxDistance = this.transform.localScale.x / 2;
	var keys = new Array();
	for (var item: DictionaryEntry in coins) {
		if (item.Value == null) {
			keys.Push(item.Key);
		} else {
			var sprite: OTAnimatingSprite = item.Value as OTAnimatingSprite;
			var distance: float = Vector2.Distance(sprite.position, position);
			var displacement: Vector2 = (sprite.position - position).normalized * Time.deltaTime * intensity * maxDistance / distance;
			if (displacement.magnitude > distance) {
				sprite.position = position;
			} else {
				sprite.position -= displacement;
			}
		}
		
	}
	
	for (var i: int = 0; i < keys.length; i++) {
		coins.Remove(keys[i]);
	}
}

function OnTriggerEnter(other: Collider) {
	if (other.gameObject.CompareTag("Coin")) {
		coins[other.name] = other.gameObject.GetComponent('OTAnimatingSprite');
	}
}

function OnTriggerExit(other: Collider) {
	coins.Remove(other.name);
}