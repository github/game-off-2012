#pragma strict
var fork: GameObject;

private var sprite: OTAnimatingSprite;
private var leftEye: OTSprite;
private var rightEye: OTSprite;
private var eyePoints: Vector2[] = [Vector2(11 / 32.0f, 14 / 32.0f), Vector2(19 / 32.0f, 16 / 32.0f), Vector2(24 / 32.0f, 19 / 32.0f), Vector2(15 / 32.0f, 21 / 32.0f), Vector2(7 / 32.0f, 19 / 32.0f)];
private var eyeCenter: Vector2 = Vector2(18 / 32.0f, 17 / 32.0f);
private var leftEyePoints: Vector2[];
private var rightEyePoints: Vector2[];
private var leftEyeCenter: Vector2;
private var rightEyeCenter: Vector2;
private var player: GameObject;
private var shootingRange: float = 17.5;
private var waitBeforeShoot: float = 1.25;
private var waitedForShoot: float = 0;
private var blinkingEyeTime: float = 0.75;
private var blinkingSince: float = 0;
private var lastBlinkingChangePosition: float = 0;
private var changeMovementWhenBlinkingEach: float = 0.05;
private var isBlinking: boolean = false;
private var originalPosition: Vector2;
function Start () {

	sprite = this.GetComponent('OTAnimatingSprite') as OTAnimatingSprite;
	sprite.PlayOnce('Watching');
	originalPosition = sprite.position;
	
	for (var child : Transform in transform) {
		if (!leftEye) {
			leftEye = child.GetComponent('OTSprite') as OTSprite;
		} else {
			rightEye = child.GetComponent('OTSprite') as OTSprite;
		}
		
	}
	
	leftEye.renderer.enabled = true;
	rightEye.renderer.enabled = true;
	
	player = GameObject.Find('player');
	
	leftEyePoints = new Vector2[eyePoints.length];
	rightEyePoints = new Vector2[eyePoints.length];
	
	for (var i:int = 0; i < eyePoints.length; i++) {
		leftEyePoints[i] = eyePoints[i];
		leftEyePoints[i].x = leftEyePoints[i].x - 1 + this.transform.position.x;
		leftEyePoints[i].y = -leftEyePoints[i].y + 0.5 + this.transform.position.y; 
		rightEyePoints[i] = eyePoints[i];
		rightEyePoints[i].x = -rightEyePoints[i].x + 1 + this.transform.position.x; 
		rightEyePoints[i].y = -rightEyePoints[i].y + 0.5 + this.transform.position.y; 
	}
	leftEyeCenter.x = -eyeCenter.x + this.transform.position.x;
	leftEyeCenter.y = -eyeCenter.y + 0.5 + this.transform.position.y;
	rightEyeCenter.x = eyeCenter.x + this.transform.position.x;
	rightEyeCenter.y = -eyeCenter.y + 0.5 + this.transform.position.y;
}

function Update () {
	processEyesPositions();
	processForks();
}

function processEyesPositions() {
	var i: int;
	var j: int;
	var intersection;
	var vectIntersection: Vector2;
	
	var playerPosition: Vector2 = Vector2(player.transform.position.x, player.transform.position.y);
	for (i = 0; i < leftEyePoints.length; i++) {
		j = (i == leftEyePoints.Length - 1) ? 0 : i + 1;
		// Debug.DrawLine(Vector3(leftEyePoints[i].x, leftEyePoints[i].y, -3), Vector3(leftEyePoints[j].x, leftEyePoints[j].y, -3), Color.red);
		intersection = getIntersection(leftEyePoints[i], leftEyePoints[j], playerPosition, leftEyeCenter);
		if (intersection !== null) {
			vectIntersection = intersection;
			leftEye.position = vectIntersection - sprite.position;
			leftEye.position.x /= 2;
			break;
		}
	}
	// Debug.DrawLine(player.transform.position, Vector3(leftEyeCenter.x, leftEyeCenter.y, -3), Color.green);
	
	for (i = 0; i < rightEyePoints.length; i++) {
		j = (i == rightEyePoints.Length - 1) ? 0 : i + 1;
		// Debug.DrawLine(Vector3(rightEyePoints[i].x, rightEyePoints[i].y, -3), Vector3(rightEyePoints[j].x, rightEyePoints[j].y, -3), Color.red);
		intersection = getIntersection(rightEyePoints[i], rightEyePoints[j], playerPosition, rightEyeCenter);
		if (intersection !== null) {
			vectIntersection = intersection;
			rightEye.position = vectIntersection - sprite.position;
			rightEye.position.x /= 2;
			break;
		}
	}
	// Debug.DrawLine(player.transform.position, Vector3(rightEyeCenter.x, rightEyeCenter.y, -3), Color.green);
}

function processForks() {
	var playerPosition: Vector2 = Vector2(player.transform.position.x, player.transform.position.y);
	var distance: float = Vector2.Distance(playerPosition, sprite.position);
	
	if (distance < shootingRange) {
		waitedForShoot += Time.deltaTime;
		blinkingSince += Time.deltaTime;
		if (!isBlinking && waitedForShoot > waitBeforeShoot) {
			waitedForShoot = 0;
			blinkingSince = 0;
			isBlinking = true;
			leftEye.renderer.enabled = false;
			rightEye.renderer.enabled = false;
			sprite.PlayOnce('Blinking');
		}
		if (isBlinking) {
			if (blinkingSince - lastBlinkingChangePosition > changeMovementWhenBlinkingEach) {
				sprite.position = originalPosition + Random.insideUnitCircle * 0.1;
				lastBlinkingChangePosition = blinkingSince;
			}
		}
		if (isBlinking && blinkingSince > blinkingEyeTime) {
			new OTSound("Missile");
			sprite.position = originalPosition;
			isBlinking = false;
			waitedForShoot = 0;
			blinkingSince = 0;
			leftEye.renderer.enabled = true;
			rightEye.renderer.enabled = true;
			sprite.PlayOnce('Watching');
			var fork1: OTSprite = GameObject.Instantiate(fork, Vector3(leftEye.position.x, leftEye.position.y, 10), Quaternion.identity).GetComponent('OTSprite') as OTSprite;
			var fork2: OTSprite = GameObject.Instantiate(fork, Vector3(rightEye.position.x, rightEye.position.y, 10), Quaternion.identity).GetComponent('OTSprite') as OTSprite;
			fork1.position = leftEye.position + sprite.position;
			fork2.position = rightEye.position + sprite.position;
			lastBlinkingChangePosition = 0;
		}
	} else {
		waitedForShoot = 0;
	}
}

// Inspired by http://www.kevlindev.com/geometry/2D/intersections/index.htm
function getIntersection (a1: Vector2, a2: Vector2, b1: Vector2, b2: Vector2) {
	var ua_t: float=(b2.x-b1.x)*(a1.y-b1.y)-(b2.y-b1.y)*(a1.x-b1.x);
	var ub_t: float=(a2.x-a1.x)*(a1.y-b1.y)-(a2.y-a1.y)*(a1.x-b1.x);
	var u_b: float=(b2.y-b1.y)*(a2.x-a1.x)-(b2.x-b1.x)*(a2.y-a1.y);
	if (u_b!=0) {
		var ua: float=ua_t/u_b;
		var ub: float=ub_t/u_b;
		if(0 <= ua && ua <= 1 && 0 <= ub && ub <= 1){
			return Vector2(a1.x+ua*(a2.x-a1.x),a1.y+ua*(a2.y-a1.y));
			//result=new Intersection("Intersection");
			//result.points.push(new Point2D(a1.x+ua*(a2.x-a1.x),a1.y+ua*(a2.y-a1.y)));
		} else {
			return null; //result=new Intersection("No Intersection");
		}
	} else {
		if(ua_t == 0 || ub_t == 0){
			return null; //result=new Intersection("Coincident");
		} else {
			return null; //result=new Intersection("Parallel");
		}
	}
	return;
}