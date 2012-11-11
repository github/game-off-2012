//Object for tower
//

//Tower Properties object
function TowerProperties() {
	this.range = 0;
	this.health = 0;
	this.damage = 0;
	this.color = 0;
	this.shape = 0;
	return this;
}

//Tower object
function Tower(x, y, name) {
	this.name = name;
	this.x = x;//X cell
	this.y = y;//y cell
	this.connections = new Array();

	//Properties
	//Each tower should have polyshape/colour based on attributes/properties
	//Should be dynamically (randomly) Generated with mutations happening in future
	this.properties = {
		range: Math.floor(Math.random() * 100) + 50,
		damage: Math.floor(Math.random() * 30) + 1,
		health: Math.floor(Math.random() * 100) + 10,
		reload: Math.floor(Math.random() * 50) + 50,
		mutate: Math.floor(Math.random() * 50) + 50, //How often the tower mutates (duration in frames)
		mutatestrength: Math.floor(Math.random() * 3)+1, //How much the tower can mutate at most (Tower can still mutate with less than this value), also note that max change in values will be (this value-1)
	};

	this.reloadcounter = this.properties.reload;
	this.mutatecounter = this.properties.mutate;
	//alert(this.properties.color);

	//Randomize properties

	//Functions 
	this.draw = towerDraw;
	this.search = towerSearch;
	this.drawRange = towerDrawRange;
	this.mutate = towerMutate;
	this.upgrade = towerUpgrade;

	return this;
}

function hexPair(num) {
	return Math.min(Math.max(num, 16), 255).toString(16);
}

function towerDraw(can) {
	this.properties.color = "#" + hexPair(255 - this.properties.health) + hexPair(this.properties.range) + hexPair(this.properties.damage);
	can.fillStyle = this.properties.color;
	//can.fillRect(this.x, this.y, 1,1);
	can.fillRect(width*this.x+spacing*this.x+spacing*(this.x+1), height*this.y+spacing*this.y+spacing*(this.y+1), width, height);
	//alert("Drawn");
	this.drawRange(can);
	return;
}

function towerDrawRange(can) {
	//alert("Drawing range circle");
	//var pos = getPxlFromCell(this.x, this.y);
	//can.fillStyle = "#00ff00";	
	//document.getElementById("outputtri").innerHTML = width*this.x+spacing*this.x+spacing*(this.x+1)+(width/2) + "\n" +  (height*this.y+spacing*this.y+spacing*(this.y+1)+(height/2));
	can.beginPath();
	//can.arc(width*this.x+spacing*this.x+spacing*(this.x+1)+(width/2), height*this.y+spacing*this.y+spacing*(this.y+1)+(height/2), this.range, 0, 2*Math.PI, false);
	can.arc(width*this.x+spacing*this.x+spacing*(this.x+1)+(width/2), height*this.y+spacing*this.y+spacing*(this.y+1)+(height/2), this.properties.range, 0, 2*Math.PI, false);
	can.linewidth = 20;
	can.strokeStyle = "#00ffff";
	can.stroke();
	return;
}

function makeDrawProperties() {
	//Generate colour and shape based on other tower properties
}

function randomize(prop) {
	prop.range = Math.floor(Math.random() * 200) + 50;
	prop.damage = Math.floor(Math.random() * 30) + 1;
	prop.health = Math.floor(Math.random() * 100) + 10;
}

	
function towerSearch(can) {
	var i;
	var towerpos = getPxlFromCell(this.x, this.y);

	//Decrement reload wait
	this.reloadcounter -= 1;

	for (i = 0; i < enemylist.length; i++) {
		if (this.reloadcounter <= 0) {
			if (Math.pow(this.properties.range, 2) > Math.pow(enemylist[i].x-towerpos[0],2) + Math.pow(enemylist[i].y-towerpos[1],2)) {
				//Enemy in range

				
				//Draw line
				can.strokeStyle = "#00ff00";
				can.beginPath();
				can.moveTo(towerpos[0]+Math.floor(width/2),towerpos[1]+Math.floor(height/2));
				can.lineTo(enemylist[i].x, enemylist[i].y);
				can.stroke();

				//Damage enemy
				enemylist[i].health -= this.properties.damage;
				
				//Reset reload
				this.reloadcounter = this.properties.reload;

			}
		}
	}
}

function towerMutate() {
	if (this.mutatecounter <= 0) {
		//Mutate
		this.properties.range += Math.floor(Math.random()*this.properties.mutatestrength*2)-this.properties.mutatestrength+1;
		this.properties.damage += Math.floor(Math.random()*this.properties.mutatestrength*2)-this.properties.mutatestrength+1;
		this.properties.reload += Math.floor(Math.random()*this.properties.mutatestrength*2)-this.properties.mutatestrength+1;

		//Make sure towers are at least barely functional
		if (this.properties.range <= 10) {
			this.properties.range = 10;
		}
		if (this.properties.damage <= 1) {
			this.properties.damage = 1;
		}
		if (this.properties.reload >= 200) {
			this.properties.range = 200;
		}


		//Reset mutatecounter
		this.mutatecounter = this.properties.mutate;
	}
	
	//decrement mutate counter
	this.mutatecounter -= 1;
	return;
}

function towerUpgrade() {
	if (money > 100) {
		this.properties.damage *= 2;
		this.properties.reload /= 2;
		money -= 100;
	}
	return;
}

function upgradeTower() {
	towerarray[selectedtower].upgrade();
}
