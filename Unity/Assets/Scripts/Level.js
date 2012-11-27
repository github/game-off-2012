#pragma strict

var prefabs = {};
private var generatedUntil:int = 0;
private var nbBySlot:int = 30; // 25 per screen
private var generateSlotBefore:int = 30;
private var lastY:float = 0;
private var maxCameraDistance: float = 2;
private var playerCamera: GameObject;
private var playerObject: GameObject;
private var slots = {};
private var slotIndex: int = 0;
private var died = false;
private var diedSince: float = 0;
private var zoneSizes: int[] = [15, 30, 50];
private var lastZoneGenerated: String = 'none';
private var cloneMode: boolean = false;
private var maxCameraDistanceXCloneMode: float = 8;
private var maxCameraDistanceYCloneMode: float = 6;
private var maxCameraSpeedCloneMode: float = 10;
function Start () {
	playerObject = GameObject.Find("player");
	playerCamera = GameObject.Find("Main Camera");
	
	loadPrefabs();
	generateBasicGround(Vector2(-12, 0), 12);
	//generateSlope(Vector2(-2.5, 0), 30, false);
	//lastY = -15;
	//generatedUntil = 30;
	generate(0, nbBySlot);
}

function generateBasicGround(position: Vector2, width: int) : float {
	generateSprite("commit", Vector2(position.x, position.y));
	generateSprite("floor", Vector2(position.x, position.y), Vector2(width, 1));
	
	generateSprite("commit", Vector2(position.x + width, position.y));
	return position.y;
}

function generateSlope(position: Vector2, width: int, goingUp: boolean) : float {
	var angleRadiant: float = (goingUp ? 1 : -1) * Mathf.Atan(0.5);
	var angle:float = angleRadiant * 360 / (2 * Mathf.PI);
	var rWidth:float = Mathf.Sqrt(5) * width / 2;
	var obj : GameObject = generateSprite("floor", Vector2(position.x, position.y), Vector2(rWidth, 1));
	obj.transform.Rotate(Vector3(0, 0, angle));
	generateSprite("commit", Vector2(position.x, position.y));
	generateSprite("commit", Vector2(position.x + width, position.y + (goingUp ? 1 : -1) * width * 0.5));
	return goingUp ? position.y + width / 2.0 : position.y - width / 2.0;
}

function generateJumpingWatcher(xFrom: float, xTo: float, y: float) {
	var obj : GameObject = generateSprite("jumpingwatcher", Vector2(xFrom, y + 0.55));
	var jw: JumpingWatcher = obj.GetComponent('JumpingWatcher') as JumpingWatcher;
	jw.initialize(xFrom, xTo);
}

function generateSprite(prefabName, position: Vector2) {
	return generateSprite(prefabName, position, new Vector2(1, 1));
}

function generateSprite(prefabName, position: Vector2, scale: Vector2) : GameObject {
	var obj: GameObject = getPrefab(prefabName, position, scale);
	var index = getIndexFromX(position.x);
	if (!slots[index]) {
		slots[index] = new Array();
	}
	var slot : Array = slots[index] as Array;
	slot.Push(obj);
	return obj;
}

function getPrefab(prefabName, position: Vector2) {
	return getPrefab(prefabName, position, new Vector2(1, 1));
}

function getPrefab(prefabName, position: Vector2, scale: Vector2) : GameObject {
	var obj: GameObject = UnityEngine.Object.Instantiate(prefabs[prefabName], Vector3(position.x, position.y, 0), Quaternion.identity) as GameObject;
	var sprite: OTSprite = obj.GetComponent('OTSprite') as OTSprite;
	if (sprite) {
		sprite.position = Vector3(position.x, position.y, 0);
	}
	obj.transform.localScale = Vector3(scale.x, scale.y, 1);
	return obj;
}

function getIndexFromX(x: float) {
	var index = Mathf.Floor(x / nbBySlot);
	if (index < 0) {
		index = 0;
	}
	return index;
}

function loadPrefabs() {
	var rawPrefabs : Object[] = Resources.LoadAll("Prefabs");
	for (var i = 0; i < rawPrefabs.length; i++) {
		var rawPrefab : GameObject = rawPrefabs[i] as GameObject;
		prefabs[rawPrefab.name] = rawPrefab;
	}
}

function position() : float {
	return playerObject.transform.position.x;
}

function Update () {
	if (!died) {
		var maxDistance: float = cloneMode ? maxCameraDistanceYCloneMode : maxCameraDistance;
	
		var newViewPosition: Vector2 = OT.view.position;
	
		if (cloneMode) {
			var xDiffCameraPlayer = playerObject.transform.position.x - OT.view.position.x;
			if (Mathf.Abs(xDiffCameraPlayer) > maxCameraDistanceXCloneMode) {
				newViewPosition.x = xDiffCameraPlayer < 0 ? playerObject.transform.position.x + maxCameraDistanceXCloneMode : playerObject.transform.position.x - maxCameraDistanceXCloneMode;
			}
		} else {
			var playerCameraPositionX: float = playerObject.transform.position.x + 8;
			if (playerCameraPositionX > 0) {
				newViewPosition.x = playerCameraPositionX;
			}
		}
		
		
		
		var yDiffCameraPlayer = playerObject.transform.position.y - OT.view.position.y;
		if (Mathf.Abs(yDiffCameraPlayer) > maxDistance) {
			newViewPosition.y = yDiffCameraPlayer < 0 ? playerObject.transform.position.y + maxDistance : playerObject.transform.position.y - maxDistance;
		}
		
		if (cloneMode) {
			var displacement: Vector2 = newViewPosition - OT.view.position;
			var maxDistanceDisplacement: float = Time.deltaTime * maxCameraSpeedCloneMode;
			if (displacement.magnitude > maxDistanceDisplacement) {
				newViewPosition = displacement.normalized * maxDistanceDisplacement + OT.view.position;
			}
		}
		
		OT.view.position = newViewPosition;
		
		if (generatedUntil - position() < generateSlotBefore) {
			generate(generatedUntil, generatedUntil + nbBySlot);
		}
	} else {
		diedSince += Time.deltaTime;
		if (diedSince > 1.5) {
			Application.LoadLevel ("score"); 
		}
	}
	
	cleanUp();
}

function cleanUp() {
	var newIndex = getIndexFromX(playerObject.transform.position.x);
	if (newIndex > slotIndex) {
		var deleteIndex = newIndex - 3;
		if (slots[deleteIndex]) {
			var slotsToDelete : Array = slots[deleteIndex] as Array;
			for (var i = 0; i < slotsToDelete.length; i++) {
				var objectToDelete: GameObject = slotsToDelete[i] as GameObject;
				GameObject.Destroy(objectToDelete);
			}
		}
		slots.Remove(deleteIndex);
		slotIndex = newIndex;
	}
}

function playerDied() {
	if (!died) {
		died = true;
		new OTSound("Falling");
	}
}

function generate(from: int, to: int) {
	while (generatedUntil < to) {
		var zoneSize: int = zoneSizes[Mathf.Floor(Random.Range(0, zoneSizes.length))];
		if (lastZoneGenerated == 'none' || lastZoneGenerated == 'islands') {
			generateGroundZone(generatedUntil, generatedUntil + zoneSize);
			break;
		}
		if (lastZoneGenerated == 'ground') {
			if (Random.value < 0.2) {
				generateSlopeZone(generatedUntil, generatedUntil + zoneSize);
			} else {
				generateIslandsZone(generatedUntil, generatedUntil + zoneSize);
			}
			break;
		}
		if (lastZoneGenerated == 'slope') {
			//if (Random.value < 0.5) {
				generateGroundZone(generatedUntil, generatedUntil + zoneSize);
			/*} else {
				generateIslandsZone(generatedUntil, generatedUntil + zoneSize);
			}*/
			break;
		}
	}
}

function generateGroundZone(from: int, to: int) {
	lastZoneGenerated = 'ground';
	var position: int = from;
	var length: int;
	var groundType: String = 'flat';
	var i: int;
	
	// begining ground
	length = Mathf.Round(Random.Range(3, 9));
	lastY = generateBasicGround(Vector2(position, lastY), length);
	if (length >= 4 && getLevelFromPosition(position) > 0 && Random.value > getLevelFromPosition(position) * 0.1 + 0.1 ) {
		generateJumpingWatcher(position + 0.5, position + length - 1, lastY);
	}
	position += length;
	
	// forecasting last ground
	var lastMinimalGroundLength: int = Mathf.Round(Random.Range(1, 4));
	
	while (position < to) {
		if (groundType == 'flat') {
			var newY: float = lastY;
			groundType = Random.value > 0.5 ? 'up' : 'down';
			length = Mathf.Round(Random.Range(1, 4)) * 2;
			
			
			if (position + length >= to - lastMinimalGroundLength) {
				length = Mathf.Floor((to - lastMinimalGroundLength - position) / 2) * 2;
			}
			
			if (length > 0) {
				newY = generateSlope(Vector2(position, lastY), length, groundType == 'up');
			}
			
			if (Random.value < 0.6) {
				generateRectangleCommit(Vector2(position, lastY), length, groundType, 0, 1);
			}
			
			lastY = newY;
		} else {
			groundType = 'flat';
			length = Mathf.Round(Random.Range(2, 6));
			var level: int = getLevelFromPosition(position);
			
			if (position + length >= to - lastMinimalGroundLength) {
				length = to - position;
			}
			
			var forksPosition: float = length == 2 ? 1 : Random.Range(position + 1, position + length - 1);
			var upperPartAvailable: boolean = true;
			var lowerPartAvailable: boolean = true;
			if (length >= 4 && level > 0 && Random.value < level * 0.1 + 0.2) {
				generateJumpingWatcher(position + 0.5, position + length - 1, lastY);
				lowerPartAvailable = false;
			} else if (length >= 2 && level > 0 && Random.value < level * 0.1 + 0.2) {
				generateSprite("forks", Vector2(forksPosition, lastY + 0.5));
				lowerPartAvailable = false;
			} else if (length >= 2 && level > 0 && Random.value < level * 0.1 + 0.1) {
				generateSprite("forksround", Vector2(forksPosition, lastY + 0.5));
				lowerPartAvailable = false;
			} else if (level >= 2 && Random.value < level * 0.1) {
				generateSprite("evilforker", Vector2(position + length / 2, lastY + 6));
				lowerPartAvailable = false;
			}
			
			if (Random.value < 0.6 && lowerPartAvailable) {
				generateRectangleCommit(Vector2(position, lastY), length, 'flat', 0, 1);
			} else if (Random.value < 0.6 && upperPartAvailable) {
				generateDiamondCommit(Vector2(position + length * 0.5, lastY));
			} else if (Random.value < 0.2 * level + 0.2) {
				generateSprite("stargazer", Vector2(position + length / 2, newY + 1.6));
			}
			
			lastY = generateBasicGround(Vector2(position, lastY), length);
		}
		
		position += length;
	}
	generatedUntil = position;
}

function generateIslandsZone(from: int, to: int) {
	lastZoneGenerated = 'islands';
	var position: int = from;
	var lastSpacing: float;
	var spacing: float;
	
	spacing = Mathf.Round(Random.Range(1, 5));
	position += spacing;
	
	while (position < to) {
		var level: int = getLevelFromPosition(position);
		var length: float = Mathf.Round(Random.Range(3 + (level > 1 ? 1 : 0), 8 - level));
		lastSpacing = spacing;
		spacing = Mathf.Round(Random.Range(2, level + 2));
		var yDecal: float = Random.value > 0.5 ? Mathf.Round(Random.Range(-2 - level, 1)) : Mathf.Round(Random.Range(0, level > 0 ? 3 : 0));
		var newY: float = yDecal + lastY;
		var jumpCommitGenerated: boolean = false;
		var jumpingWatcherGenerated: boolean = false;
		
		if (position + spacing > to) {
			break;
		}
		
		if (position + length + spacing > to) {
			length = Mathf.Max(2, to - position - spacing);
			spacing = to - position - length;
		}
		
		
		if (Random.value < 0.2) {
			generateJumpCommit(Vector2(position - lastSpacing - 1, lastY), Vector2(position + 1, newY));
			jumpCommitGenerated = true;
		}
		
		lastY = generateBasicGround(Vector2(position, newY), length);
		
		if (length >= 4 && level > 0 && Random.value < level * 0.1 + 0.1) {
			generateJumpingWatcher(position + 0.5, position + length - 1, newY);
			jumpingWatcherGenerated = true;
		} else if (level > 2 && Random.value < 0.2) {
			generateSprite("evilforker", Vector2(position + length / 2, newY + 8));
		}
		
		if (!jumpCommitGenerated && !jumpingWatcherGenerated) {
			if (Random.value < 0.5) {
				generateRectangleCommit(Vector2(position, newY), length, 'flat', 0, 1);
			} else if (Random.value < 0.2 * level + 0.2) {
				generateSprite("stargazer", Vector2(position + length / 2, newY + 1.6));
			}
		}
		
		if (level > 1 && length >= 4 && Random.value < level * 0.1) {
			generateSprite("forksround", Vector2(position - spacing / 2.0, newY - yDecal + 1));
			generateSprite("forksround", Vector2(position - spacing / 2.0, newY - yDecal + 5));
		} else if (level > 0 && (yDecal > -2 || (yDecal > -3 && length >= 3)) && Random.value < level * 0.2 + 0.2) {
			var additionalDecal: int = (yDecal > -2 && length >= 4 && Random.value > 0.5) ? 2 : 1;
			generateSprite("forksround", Vector2(position - spacing * 0.5, newY - yDecal + additionalDecal));
		}
		
		
		
		position += length + spacing;
	}
	generatedUntil = position;
}

function generateSlopeZone(from: int, to: int) {
	lastZoneGenerated = 'slope';
	var fromY: float = lastY;
	lastY = generateSlope(Vector2(from, lastY), to - from, false);
	var step: int = 10;
	for (var i : int = 0; i < to - from; i += step) {
		var position: int = i + Random.Range(0, step);
		var level: int = getLevelFromPosition(from + position);
		var forksRoundGenerated: boolean = false;
		if (level > 0 && Random.value < level * 0.1 + 0.2) {
			generateSprite("forksround", Vector2(position + from, fromY - position * 0.5 + 1));
			forksRoundGenerated = true;
		} else if (level > 1 && Random.value < level * 0.1) {
			generateSprite("forksround", Vector2(position + from, fromY - position * 0.5 + 1));
			generateSprite("forksround", Vector2(position + from, fromY - position * 0.5 + 6));
			forksRoundGenerated = true;
		} else if (level > 1 && Random.value < level * 0.1) {
			position = i + step / 2;
			generateSprite("evilforker", Vector2(position + from, fromY - position * 0.5 + 6));
		}
		
		if (!forksRoundGenerated) {
			var length: int = Mathf.Min((to - from) - i, 10);
			generateRectangleCommit(Vector2(i + from, fromY - i * 0.5), length, 'down', 0, Mathf.Round(Random.Range(1, 4)));
		}
	}
	generatedUntil = to;
}

function getLevelFromPosition(position: int) : int {
	if (position < 100) {
		return 0;
	} else if (position < 300) {
		return 1;
	} else if (position < 600) {
		return 2;
	} else {
		return 3;
	}
}

function generateRectangleCommit(position: Vector2, length: int, groundType: String, top: float, height: int) {
	for (var i: int = 1; i < length; i++) {
		for (var j: int = 0; j < height; j++) {
			if (groundType == 'flat') {
				generateUniqueCommit(Vector2(position.x + i, position.y + top + j));
			} else {
				generateUniqueCommit(Vector2(i + position.x + (groundType == 'up' ? -0.25 : 0.25) + (top + j) * 0.3, position.y + i * (groundType == 'up' ? 0.5 : -0.5) + (top + j) * Mathf.Sqrt(0.75) * 0.6));
			}
		}
	}
}

function generateUniqueCommit(position: Vector2) {
	generateSprite("coincommit", position + Vector2(0, 0.6));
}

function generateDiamondCommit(position: Vector2) {
	generateSprite("coincommit", position + Vector2(0, 2.1));
	generateSprite("coincommit", position + Vector2(-0.5, 2.6));
	generateSprite("coincommit", position + Vector2(0.5, 2.6));
	generateSprite("coincommit", position + Vector2(0, 3.1));
}

function generateJumpCommit(positionFrom: Vector2, positionTo: Vector2) {
	
	var positionIntermediary: Vector2 = Vector2((positionFrom.x + positionTo.x) * 0.5, Mathf.Max(1, 3 - Mathf.Abs(positionFrom.y - positionTo.y)) + Mathf.Max(positionFrom.y, positionTo.y));
	var nb: int;
	var progression: float;
	var heightProgression: float;
	var widthProgression: float;
	var i: int;
	var position: Vector2;
	nb = Mathf.Floor(Vector2.Distance(positionFrom, positionIntermediary)) + 2;
	for (i = 0; i < nb; i++) {
		progression = i * 1.0 / (nb - 1);
		widthProgression = (1 - Mathf.Cos(progression * Mathf.PI / 2)) * 0.5 + progression * 0.5;
		heightProgression = Mathf.Sin(progression * Mathf.PI / 2);
		position = Vector2(widthProgression * (positionIntermediary.x - positionFrom.x) + positionFrom.x, heightProgression * positionIntermediary.y + (1.0 - heightProgression) * positionFrom.y);
		generateUniqueCommit(position);
	}
	nb = Mathf.Floor(Vector2.Distance(positionIntermediary, positionTo)) + 2;
	for (i = 1; i < nb; i++) {
		progression = i * 1.0 / (nb - 1);
		widthProgression = (Mathf.Sin(progression * Mathf.PI / 2)) * 0.5 + progression * 0.5;
		heightProgression = 1 - Mathf.Cos(progression * Mathf.PI / 2);
		position = Vector2(widthProgression * (positionTo.x - positionIntermediary.x) + positionIntermediary.x, heightProgression * positionTo.y + (1.0 - heightProgression) * positionIntermediary.y);
		generateUniqueCommit(position);
	}
}

function setCloneMode(newCloneMode) {
	cloneMode = newCloneMode;
}