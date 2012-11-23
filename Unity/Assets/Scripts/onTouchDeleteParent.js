#pragma strict

function OnTriggerEnter(other: Collider) {
	
	if (other.gameObject.CompareTag("Player")) {
		GameObject.Destroy(this.transform.parent.gameObject);
	}
}