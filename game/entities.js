function Tile(x, y, w, h) {
	this.hover = false;

	this.tPos = new temporalPos(x, y, w, h, 0, 0);
	this.base = new baseObj("Tile", 2);

	this.update = function (dt) {
		this.tPos.update(dt);
		
		if (this.base)
			return this.base.update(dt);
	};

	this.draw = function (pen) {
		var p = this.tPos;

		pen.fillStyle = "transparent";
		if (this.hover) {
			pen.strokeStyle = "yellow";
		} else {
			pen.strokeStyle = "white";
		}
		ink.rect(p.x, p.y, p.w, p.h, pen);

		if (this.base)
			this.base.draw(pen);

		//Strange... but we can't set this during update!
		this.hover = false;
	};
}

function Path_End(x, y, w, h) {
	this.tPos = new temporalPos(x, y, w, h, 0, 0);
	this.base = new baseObj("Path_End", 1);

	this.update = function (dt) {
		this.tPos.update(dt);

		if (this.base)
			return this.base.update(dt);
	};

	this.draw = function (pen) {
		var p = this.tPos;
		pen.fillStyle = "grey";
		pen.strokeStyle = "lightgreen";
		ink.rect(p.x, p.y, p.w, p.h, pen);

		if(this.base)
			this.base.draw(pen);
	};
}

function Path_Start(x, y, w, h) {
	this.tPos = new temporalPos(x, y, w, h, 0, 0);
	this.base = new baseObj("Path_Start", 1);

	//This is set after we are made
	//this.nextPath

	this.update = function (dt) {
		this.tPos.update(dt);

		if (this.base)
			return this.base.update(dt);
	};

	this.draw = function (pen) {
		var p = this.tPos;
		pen.fillStyle = "yellow";
		pen.strokeStyle = "lightgreen";
		ink.rect(p.x, p.y, p.w, p.h, pen);

		if (this.base)
			this.base.draw(pen);
	};
}


function Path_Line(pathBase) {
	this.path = pathBase;

	//Our shape is a lie! (its off, not that it really matters)
	this.tPos = new temporalPos(pathBase.tPos.x, pathBase.tPosy, pathBase.tPosw, pathBase.tPosh, 0, 0);
	this.base = new baseObj("Path_Line", 2);

	this.update = function (dt) {
		this.tPos.update(dt);

		if (this.base)
			return this.base.update(dt);
	};

	this.draw = function (pen) {
		if (pathBase.nextPath) {
			var t = pathBase.nextPath.tPos.getCenter();
			var direction = new Vector(t.x, t.y);
			direction.subtract(pathBase.tPos.getCenter());

			var start = pathBase.tPos.getCenter();
			//direction.setMag(pathBase.tPos.w / 2);
			//start.subtract(direction);

			var end = new Vector(start.x, start.y);
			direction.setMag(pathBase.tPos.w);
			end.add(direction);

			pen.strokeStyle = "blue";
			ink.arrow(start.x, start.y, end.x, end.y, pen);
		}

		if (this.base)
			this.base.draw(pen);
	};
}
function Path(x, y, w, h) {
	this.tPos = new temporalPos(x, y, w, h, 0, 0);
	this.base = new baseObj("Path", 1);
	this.pathLine = null;

	this.update = function (dt) {
		this.tPos.update(dt);

		var newObjs = []

		if (this.nextPath && !this.pathLine) {
			this.pathLine = new Path_Line(this);
			newObjs.push(this.pathLine);
		}

		if (this.base)
			newObjs = merge(newObjs, this.base.update(dt));

		return newObjs;
	};

	this.draw = function (pen) {
		var p = this.tPos;
		pen.fillStyle = "green";
		pen.strokeStyle = "lightgreen";
		ink.rect(p.x, p.y, p.w, p.h, pen);

		if (this.base)
			this.base.draw(pen);
	};
}

function Tower_Range(x, y, w, h) {
	this.tPos = new temporalPos(x, y, w, h, 0, 0);
	this.base = new baseObj("Tower_Range", 11);

	this.update = function (dt) {
		this.tPos.update(dt);

		if(this.base)
			return this.base.update(dt);
	};

	this.draw = function (pen) {
		var p = this.tPos;
		pen.lineWidth = 2;
		pen.fillStyle = "transparent";
		pen.strokeStyle = "blue";
		ink.circ(p.x + w / 2, p.y + h / 2, w / 2, pen);

		if(this.base)
			this.base.draw(pen);
	};
}

function Tower_Laser(xs, ys, xe, ye, duration) {
	this.tPos = new temporalPos(xs, ys, xe - xs, ye - ys, 0, 0);
	this.base = new baseObj("Tower_Laser", 12);

	this.base.addObject(new lifetime(duration));

	this.update = function (dt) {
		this.tPos.update(dt);

		if (this.base)
			return this.base.update(dt);
	};

	this.draw = function (pen) {
		var p = this.tPos;

		pen.strokeStyle = "purple";
		pen.save();
		pen.lineWidth = 2;
		ink.line(p.x, p.y, p.x + p.w, p.y + p.h, pen);
		pen.restore();

		if (this.base)
			this.base.draw(pen);
	};
}

//All mutate stuff is copy-pasta from our mother project (for now)
function Tower(x, y, w, h) {
	this.tPos = new temporalPos(x, y, w, h, 0, 0);
	this.base = new baseObj("Tower", 10);
	this.attr = {
		range:          Math.random() * 200 + 100,
		damage:         Math.random() * 30  + 1,
		hp:             Math.random() * 100 + 10,
		coolDown:       Math.random() * 1   + 1,
		mutate:         Math.random() * 1   + 1,
		mutatestrength: Math.random() * 3   + 1,
	}
	
	var laserTime = 0.1;
	var nextFireIn = this.attr.coolDown;
	var mutateCounter = this.attr.mutate;

	this.draw = function (pen) {
		var p = this.tPos;
		pen.save();
		pen.fillStyle = this.color;
		pen.strokeStyle = "lightblue";
		ink.rect(p.x, p.y, p.w, p.h, pen);
		pen.restore();

		if (this.base)
			this.base.draw(pen);
	};

	// WTF
	this.tryUpgrade = function () {
		if (eng.money >= 100 && this.attr.coolDown >= (2 / 50)) {
			this.damage *= 2;
			this.attr.coolDown /= 2;
			eng.money -= 100;
		}
	}

	this.mutate = function() {
		var a = this.attr;
		
		for (at in a) {
			a[at] += (Math.random() - 0.5) * a.mutatestrength * a[at] * 0.30;
			a[at] = Math.floor(a[at] + 0.5);
		}
		
		if (a.mutatestrength < 1) {
			a.mutatestrength = 1;
		}
		// Make sure towers are at least barely functional
		if (a.range <= 20) {
			a.range = 20;
		}
		if (a.damage <= 1) {
			a.damage = 1;
		}
		if (a.coolDown >= 4) {
			a.range = 80;
		}
		
		this.color = "#" + hexPair(255 - a.hp) + hexPair(a.range) + hexPair(a.damage);
	}
	this.attack = function() {
		var target = findClosest(eng, "Bug", this.tPos.getCenter(), this.attr.range + 0.01);
		console.log("Found target:", target); 
		if (!target) {
			return;
		}
		
		target.hp -= this.attr.damage;
		
		var cent1 = this.tPos.getCenter();
		var cent2 = target.tPos.getCenter();
		
		return new Tower_Laser(cent1.x, cent1.y, cent2.x, cent2.y, laserTime);
		
	}
	this.update = function (dt) {
		mutateCounter -= dt;
		if (mutateCounter < 0) {
			this.mutate();
			mutateCounter = this.attr.mutate;
		}
		
		var newObjs = [];
		nextFireIn -= dt;
		if (nextFireIn < 0) {
			var newObj = this.attack();
			if (newObj) {
				newObjs.push(newObj);
			}
			nextFireIn = this.attr.coolDown;
		}

		if (this.base)
			newObjs = merge(newObjs, this.base.update(dt));

		return newObjs;
	}
	this.mutate();
}

function Bug(startPath, r) {
	this.maxHP = 20;	  
	this.hp = this.maxHP;
	this.value = 15;
	this.speed = 20;

	this.base = new baseObj("Bug", 10);

	var cen = { x: startPath.tPos.x, y: startPath.tPos.y };
	cen.x += Math.floor((startPath.tPos.w - 2*r) * Math.random()) + r;
	cen.y += Math.floor((startPath.tPos.h - 2*r) * Math.random()) + r;

	this.tPos = new temporalPos(cen.x - r, cen.y - r, r * 2, r * 2, this.speed, 0);

	this.curPath = startPath;

	this.update = function (dt) {
		this.tPos.update(dt);

		var cur = this.curPath;
		var next = this.curPath.nextPath;

		var vecToNext = distBetweenRectsFullOverlap(next.tPos, this.tPos);

		vecToNext.setMag(this.speed);
		this.tPos.dx = vecToNext.x;
		this.tPos.dy = vecToNext.y;

		//Move the next path
		var outOfPath = vecBetweenRects(cur.tPos, this.tPos).magSq();
		if (outOfPath > 0 || vecToNext.magSq() == 0) {
			var vecToTouchNext = vecBetweenRects(next.tPos, this.tPos);
			if (vecToTouchNext.magSq() == 0) {
				this.curPath = next;
				if (next instanceof Path_End) {
					this.base.destroySelf = true;
					eng.health -= 50;

					if (eng.health < 0)
						window.location.reload();
				}
			}
		}

		if (this.hp < 0) {
			this.base.destroySelf = true;

			eng.money += this.value;
		}

		if (this.base)
			return this.base.update(dt);
	};
	this.draw = function (pen) {
		var p = this.tPos;
		pen.fillStyle = "#F0F0" + hexPair(255 - this.hp / this.maxHP * 255);
		pen.strokeStyle = "orange";
		pen.save();
		pen.lineWidth = 1;
		ink.circ(p.x + p.w / 2, p.y + p.h / 2, p.w / 2, pen);
		pen.restore();

		if (this.base)
			this.base.draw(pen);
	};
}

function lifetime(timeLeft) {
	//this.tPos = new temporalPos(x, y, w, h, 0, 0);
	this.base = new baseObj("lifetime");

	var currentTimeLeft = timeLeft;

	this.update = function (dt) {
		currentTimeLeft -= dt;

		if (currentTimeLeft < 0) {
			this.base.parent.destroySelf = true;
			this.base.destroySelf = true;
		}

		return 0;
	};

	this.draw = function (pen) {
		return 0;
	};
}