#pragma strict
private var fallAcceleration:float = 20;
private var maxFallSpeed:float = 10;
private var jumpingSpeed:float = 5;
private var maxJumpingDuration:float = 0.5;
private var jumpOffset:float = 0.5;
private var maxSpeedMult: float = 3;

private var sprite:OTAnimatingSprite;
private var baseSpeed: float = 4;
private var speed: float;
private var currentSpeedMult: float;
private var contextSpeedMult: float;
private var contextVarianceSpeedMult: float;
private var fallSpeed: float;
private var onGround: boolean;
private var currentGroundAngle: float;
private var currentGroundStart: Vector2;
private var currentGroundWidth: float;
private var currentGroundPosition: float;
private var isJumping: boolean;
private var jumpingSince: float;
private var collidingGrounds = {};
private var level: Level;
private var currentAnimation: String;
private var isDying: boolean;
private var isThereAnyGroundUnderObject: GameObject;
private var isThereAnyGroundUnderScript: isThereAnyGroundUnder;
private var magnetObject: GameObject;
private var hasDestroyedEnemyBonusJump: boolean = false;
private var nbBonusJumpsRemaining: int = 0;
private var nbBonusJumps: int = 0;
private var lastTimeMusicalNote: float = 0;
private var lastMusicalNote: int = 0;

private var isSlowDown: boolean = false;
private var slowDownSince: float = 0;
private var lastSlowDown: float = -30;

private var hasCollidedWeakZone: boolean = false;
private var hasCollidedTouchAndDie: boolean = false;
private var weakZonePosition: Vector2;

private var dragAndDropStartingTime: float;
private var dragAndDropMaxYDistance: float = 50;
private var dragAndDropMaxXDistance: float = 30;
private var dragAndDropStartingPosition: Vector2;
private var dragAndDropMode: boolean = false;
private var nbBonusClones: int = 0;


private var timebonusObject: GameObject;
private var timebonusSprite: OTSprite;

private var clones: GameObject[];
private var clonesSprite: OTSprite[];

private var clickOrPressSpaceHelp: GameObject;
private var jumpOnAnEnemyHelp: GameObject;
private var releaseNewCloneHelp: GameObject;

private var lastSpark: float;

private var startTime: float;

function Start () {
	startTime = Time.time;
	lastSpark = Time.time;
	sprite = this.GetComponent('OTAnimatingSprite') as OTAnimatingSprite;
	timebonusObject = GameObject.Find('timebonus');
	level = GameObject.Find('Game').GetComponent('Level') as Level;
	isThereAnyGroundUnderObject = this.gameObject.Find('isThereAnyGroundUnder');
	isThereAnyGroundUnderScript = isThereAnyGroundUnderObject.GetComponent('isThereAnyGroundUnder') as isThereAnyGroundUnder;
	magnetObject = this.gameObject.Find('magnet');
	chooseAnimation('Running');
	fallSpeed = 0;
	onGround = false;
	currentSpeedMult = 1;
	isDying = false;
	
	timebonusObject.renderer.enabled = PlayerData.canSlowDownTime();
	timebonusSprite = timebonusObject.GetComponent('OTSprite') as OTSprite;

	nbBonusJumps = PlayerData.getNbBonusJumps();
	nbBonusClones = PlayerData.getNbBonusClones();
	
	clones = new GameObject[3];
	clonesSprite = new OTSprite[3];
	
	clones[0] = GameObject.Find('clone_1');
	clones[1] = GameObject.Find('clone_2');
	clones[2] = GameObject.Find('clone_3');
	clonesSprite[0] = clones[0].GetComponent('OTSprite') as OTSprite;
	clonesSprite[1] = clones[1].GetComponent('OTSprite') as OTSprite;
	clonesSprite[2] = clones[2].GetComponent('OTSprite') as OTSprite;
	
	refreshClones();
	
	clickOrPressSpaceHelp = GameObject.Find('clickOrPressSpace');
	jumpOnAnEnemyHelp = GameObject.Find('jumpOnAnEnemy');
	releaseNewCloneHelp = GameObject.Find('releaseNewClone');
	
	clickOrPressSpaceHelp.renderer.enabled = false;
	jumpOnAnEnemyHelp.renderer.enabled = false;
	releaseNewCloneHelp.renderer.enabled = false;
	
	if (PlayerData.isMagnet()) {
		magnetObject.collider.enabled = true;
		var scale: float = PlayerData.magnetSize();
		magnetObject.transform.localScale = Vector3(scale, scale, scale);
	}
}

function refreshClones() {
	var nbTotalClones: int = PlayerData.getNbBonusClones();
	for (var i: int = 0; i < clones.length; i++) {
		if (i >= nbTotalClones) {
			clones[i].renderer.enabled = false;
		} else {
			clones[i].renderer.enabled = true;
			clonesSprite[i].alpha = i >= nbBonusClones ? 0.3 : 1;
		}
	}
}

function chooseAnimation(name: String) {
	if (currentAnimation != name) {
		currentAnimation = name;
		sprite.Play(name);
	}
}

function Update () {
	clickOrPressSpaceHelp.renderer.enabled = (Time.time - startTime) < 10;

	if (dragAndDropMode) {
		processDragAndDropMode();
		return;
	}

	updateSpeed();
	var width: float = isThereAnyGroundUnderObject.transform.localScale.y * speed * maxSpeedMult / maxFallSpeed;
	isThereAnyGroundUnderObject.transform.localScale.x = width * 2;
	isThereAnyGroundUnderObject.transform.localPosition.x = width;
	processCollisions();
	processJump();
	processFall();
	processSpeed();
	processSlowDownBonus();
}

function processSparks() {
	if (currentAnimation == 'Sliding' && onGround) {
		if (Time.time> lastSpark + (0.5 / speed) ) {
			//Debug.Log('here');
			var obj:GameObject = level.getPrefab('spark', sprite.position + Vector2(-0.2, -0.4));
			//generateParticles('spark', sprite.position, 1, 0, Vector2(0, 0), Vector2(0, 0));
			lastSpark = Time.time;
		}
	}
}

function processDragAndDropMode() {
	var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	var newPosition = Vector2(ray.origin.x, ray.origin.y);
	var diff: Vector2 = newPosition - dragAndDropStartingPosition;
	if (Mathf.Abs(diff.y) > dragAndDropMaxYDistance) {
		diff.y = diff.y > 0 ? dragAndDropMaxYDistance : -dragAndDropMaxYDistance;
	}
	if (Mathf.Abs(diff.x) > dragAndDropMaxXDistance) {
		diff.x = diff.x > 0 ? dragAndDropMaxXDistance : -dragAndDropMaxXDistance;
	}
	sprite.position = diff + dragAndDropStartingPosition;
	var timeClock: float = Time.time;
	timeClock -= Mathf.Floor(timeClock);
	this.renderer.enabled = timeClock < 0.25 || (timeClock > 0.5 && timeClock < 0.75);
}

function processSlowDownBonus() {
	if (isSlowDown) {
		slowDownSince += Time.deltaTime;
		if (slowDownSince > PlayerData.getSlowDownTime()) {
			Time.timeScale = 1;
			isSlowDown = false;
		}
	}
	
	if (Time.time - lastSlowDown > PlayerData.getSlowDownIntervalTime()) {
		timebonusSprite.alpha = 1;
	}
}

function updateSpeed() {
	if (sprite.position.x < 100) {
		speed = 5;
	} else if (sprite.position.x < 500) {
		speed = 5 + 0.5 * (sprite.position.x - 100) / 100.0;
	} else if (sprite.position.x < 900) {
		speed = 7 + 0.25 * (sprite.position.x - 500) / 100.0;
	} else {
		speed = 8 + 0.1 * (sprite.position.x - 900) / 100.0;
	}
}

function processCollisions() {
	// We process collisions here since we may have collided with a weak zone and a touch and die at the same time...
	if (hasCollidedWeakZone) {
		generateParticles('destroyed', Vector2(weakZonePosition.x, weakZonePosition.y), 12, 16, Vector2(0, 0), Vector2(0, 0));
		new OTSound("Pop");
		fallSpeed = -7;
		hasDestroyedEnemyBonusJump = true;
	} else if (hasCollidedTouchAndDie) {
		chooseAnimation('Dying');
		generateParticles('hurt', 12, 16, Vector2(0, 0), Vector2(0, 0));
		new OTSound("Hurt");
		playerDied();
	}
	hasCollidedWeakZone = false;
	hasCollidedTouchAndDie = false;
}

function processSpeed() {
	if (!onGround) {
		contextSpeedMult = 1;
		contextVarianceSpeedMult = 0.2;
		sprite.position.x += Time.deltaTime * speed * currentSpeedMult;
	} else {
		if (currentGroundAngle == 0) {
			contextSpeedMult = 1;
			contextVarianceSpeedMult = 0.8;//0.8;
			chooseAnimation('Running');
		} else if (Mathf.Sin(currentGroundAngle) > 0) {
			contextSpeedMult = 0.85;
			contextVarianceSpeedMult = 0.8;
			chooseAnimation('Running');
		} else {
			contextSpeedMult = 2;
			contextVarianceSpeedMult = 1;
			chooseAnimation('Sliding');
		}
		currentGroundPosition += Time.deltaTime * speed * currentSpeedMult;
		sprite.position.x = Mathf.Cos(currentGroundAngle) * currentGroundPosition + currentGroundStart.x;
		sprite.position.y = Mathf.Sin(currentGroundAngle) * currentGroundPosition + currentGroundStart.y + 0.5;
		sprite.speed = currentSpeedMult;
		//sprite.rotation = currentGroundAngle * 360 / (Mathf.PI * 2);
	}
	
	currentSpeedMult += ((currentSpeedMult > contextSpeedMult) ? -1 : 1) * contextVarianceSpeedMult * Time.deltaTime;
}

function processJump() {
	if (isJumping) {
		sprite.position.y += Time.deltaTime * jumpingSpeed;
		if (jumpingSince + maxJumpingDuration < Time.time) {
			triggerStopJump();
		}
		chooseAnimation('Jumping-up');
	}
}

function processFall() {
	if (!onGround && !isJumping) {
		sprite.position.y -= Time.deltaTime * fallSpeed;
		var previousFallSpeed = fallSpeed;
		fallSpeed += Time.deltaTime * fallAcceleration;
		if (fallSpeed > maxFallSpeed) {
			fallSpeed = maxFallSpeed;
		}
		var jumpingMiddleThreshold = 0.4;
		if (!isDying) {
			if (fallSpeed > jumpingMiddleThreshold) {
				chooseAnimation('Falling');
			} else if (fallSpeed < -jumpingMiddleThreshold) {
				chooseAnimation('Jumping-up');
			} else {
				chooseAnimation('Jumping-middle');
			}
		}
	}
}

function OnTriggerEnter(other: Collider) {
	if (isDying) {
		return;
	}
	var groundAngle: float = other.transform.eulerAngles.z * 2 * Mathf.PI / 360;
	var width: float = Mathf.Cos(groundAngle) * other.transform.localScale.x;
	var height: float = Mathf.Sin(groundAngle) * other.transform.localScale.x;
	var groundStart: Vector2 = Vector2(other.transform.position.x, other.transform.position.y);
	var positionVect: Vector2 = new Vector2(sprite.position.x - groundStart.x, sprite.position.y - 0.5 - groundStart.y);
	var unitVect: Vector2 = new Vector2(width, height);
	var groundPosition: float = Vector2.Dot(positionVect, unitVect) / (other.transform.localScale.x);
	var positionOnGround: Vector2 = new Vector2(groundPosition * Mathf.Cos(groundAngle) + groundStart.x, groundPosition * Mathf.Sin(groundAngle) + groundStart.y);
	// @todo : process the decal when jumping on an rotated ground
	// it is due to the fact that the center of the pl
	
	// when the ground was going up, there was some bug (player continued sliding on the flat ground. (height > 0 ? 0 : 0.5) tries to fix that...
	var isOnGround: boolean = (positionOnGround.x > groundStart.x + (height > 0 ? 0 : 0.5) && positionOnGround.x < groundStart.x + width - 0.5)  || sprite.position.y - 0.1 > positionOnGround.y;
	
	//Debug.Log('ENTER');
	if (other.gameObject.CompareTag("Ground") && !isJumping && fallSpeed > 0 && isOnGround && !collidingGrounds.ContainsKey(other.gameObject.GetInstanceID())) {
		collidingGrounds[other.gameObject.GetInstanceID()] = other.gameObject;
		//Debug.Log('effective: ' + other.gameObject.GetInstanceID());
		if (dragAndDropMode) {
			//Debug.Log(collidingGrounds.Count);
			return;
		}
		
		if (!onGround) {
			if (height < 0) {
				chooseAnimation('Sliding');
			} else {
				chooseAnimation('Running');
			}
			
			generateParticles('cloud', 4, 2, Vector2(0f, 0.5f), Vector2(-1, 1));
		}
		
		currentGroundAngle = groundAngle;
		currentGroundStart = groundStart;
		currentGroundWidth = other.transform.localScale.x;
		currentGroundPosition = groundPosition;
		onGround = true;
		hasDestroyedEnemyBonusJump = false;
		nbBonusJumpsRemaining = nbBonusJumps;
	}
	
	//Debug.Log(collidingGrounds.Count);
	
	var isTouchAndDie:boolean = other.gameObject.CompareTag("TouchAndDie");
	var isWeakZone:boolean = other.gameObject.CompareTag("WeakZone");
	
	if (isWeakZone && !onGround && fallSpeed > 0) {
		hasCollidedWeakZone = true;
		weakZonePosition = other.transform.parent.position;
	} else if (isTouchAndDie || isWeakZone) {
		// If the collider is a weak zone here, that is because player is not jumping down.
		// Therefore, it is equivalent to a touchAndDie...
		hasCollidedTouchAndDie = true;
	}
	
	if (other.gameObject.CompareTag("Coin")) {
		if (Time.time > lastTimeMusicalNote + 1) {
			lastMusicalNote = 0;
		} else {
			lastMusicalNote = (lastMusicalNote + 1) % 8;
		}
		lastTimeMusicalNote = Time.time;
		//new OTSound('N' + lastMusicalNote);
		new OTSound('N4');
		GameObject.Destroy(other.gameObject);
		PlayerData.addCoin();
	}
	
	if (other.gameObject.CompareTag("Stargazer")) {
		GameObject.Destroy(other.gameObject);
		new OTSound('Stargazer');
		PlayerData.addStargazer();
	}
}

function OnTriggerExit(other: Collider) {
	if (isDying) {
		return;
	}

	//Debug.Log('EXIT');
	if (other.gameObject.CompareTag("Ground") && collidingGrounds.ContainsKey(other.gameObject.GetInstanceID())) {
		collidingGrounds.Remove(other.gameObject.GetInstanceID());
		//Debug.Log('effective' + other.gameObject.GetInstanceID());
		if (dragAndDropMode) {
			//Debug.Log(collidingGrounds.Count);
			return;
		}
		if (collidingGrounds.Count == 0) {
			onGround = false;
			if (fallSpeed > 0) {
				fallSpeed = 0;
			}
		}
		//sprite.rotation = 0;
	}
	//Debug.Log(collidingGrounds.Count);
	
}

function triggerJump() {
	if (dragAndDropMode) {
		unlockDragAndDrop();
		return;
	}
	if (isDying) {
		return;
	}
	if (hasDestroyedEnemyBonusJump || nbBonusJumpsRemaining > 0 || (!isJumping && onGround)) {
		if (!(!isJumping && onGround)) {
			if (hasDestroyedEnemyBonusJump) {
				hasDestroyedEnemyBonusJump = false;
			} else if (nbBonusJumpsRemaining > 0) {
				nbBonusJumpsRemaining--;
			}
		}
		
		isJumping = true;
		jumpingSince = Time.time;
		
		generateParticles('cloud', 6, 4, Vector2(0.2f, 0.2f), Vector2(1, 1));
		
		
		sprite.position.y += jumpOffset;
		onGround = false;
		new OTSound("Jump");
	}
}

function generateParticles(name: String, intensity: float, speed: float, decalStartingPosition: Vector2, decalSpeed: Vector2) {
	generateParticles(name, sprite.position, intensity, speed, decalStartingPosition, decalSpeed);
}

function generateParticles(name: String, position: Vector2, intensity: float, speed: float, decalStartingPosition: Vector2, decalSpeed: Vector2) {
	var nbClouds:int = Mathf.Round(Random.Range(intensity / 1.5, intensity * 1.5));
	for (var i = 0; i < nbClouds; i++) {
		var decal:Vector2 = Random.insideUnitCircle * 0.4 - decalStartingPosition;
		var obj:GameObject = level.getPrefab(name, position + decal);
		var particlesComponent:Particles = obj.GetComponent('Particles') as Particles;
		particlesComponent.setSpeed(decal * speed + decalSpeed);
		var scale = particlesComponent.getScale();
		obj.transform.localScale = Vector3(scale, scale, 1);
	}
}

function triggerStopJump() {
	if (isJumping) {
		isJumping = false;
		fallSpeed = -jumpingSpeed;
	}
}

function noGroundUnder() {
	playerDied();
}

function playerDied() {
	this.collider.enabled = false;
	if (nbBonusClones > 0) {
		new OTSound('Clone');
		nbBonusClones--;
		refreshClones();
		dragAndDropMode = true;
		dragAndDropStartingPosition = sprite.position;
		dragAndDropStartingTime = Time.time;
		releaseNewCloneHelp.renderer.enabled = true;
		magnetObject.collider.enabled = false;
		level.setCloneMode(true);
	} else {
		isDying = true;
		onGround = false;
		level.playerDied();
	}
}

function unlockDragAndDrop() {
	if (Time.time < dragAndDropStartingTime + 1) {
		return;
	}
	hasCollidedWeakZone = false;
	hasCollidedTouchAndDie = false;
	releaseNewCloneHelp.renderer.enabled = false;
	this.collider.enabled = true;
	dragAndDropMode = false;
	level.setCloneMode(false);
	onGround = false;
	isThereAnyGroundUnderScript.disabled = false;
	this.renderer.enabled = true;
	fallSpeed = 0;
	currentSpeedMult = 0;
	if (PlayerData.isMagnet()) {
		magnetObject.collider.enabled = true;
	}
}

function triggerSlowDown() {
	if (isDying || dragAndDropMode) {
		return;
	}
	if (PlayerData.canSlowDownTime() && (Time.time - lastSlowDown > PlayerData.getSlowDownIntervalTime())) {
		isSlowDown = true;
		slowDownSince = 0;
		timebonusSprite.alpha = 0.3;
		lastSlowDown = Time.time;
		Time.timeScale = 0.5;
	}
}

function isOnDragAndDropMode() {
	return dragAndDropMode;
}	
