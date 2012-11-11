var enemylist = new Array();
function Enemy() {
	//Enemy object
	this.health = 100;
	this.totalhealth = this.health;
	this.speed = 1;
	this.pathcell = 0; //Index of pathlist cell that enemy is on
	this.x = getPxlFromCell(pathlist[this.pathcell][0], pathlist[this.pathcell][1])[0] ; //Pixel coordinates
	this.y = getPxlFromCell(pathlist[this.pathcell][0], pathlist[this.pathcell][1])[1] ; //Pixel coordinates
	this.cell = []; //Current cell
	
	//Functions
	this.update = enemyUpdate;
	this.draw = enemyDraw;
	return this;

}	

function enemyUpdate() {
	document.getElementById("outputquad").innerHTML = this.pathcell;
	document.getElementById("outputquad").innerHTML += JSON.stringify(this.cell);

	//Are we on last cell of path?
	if (this.pathcell == (pathlist.length-1)) {
		alert ("You lose!");
		clearInterval(runInterval);
	}

	//Find current cell that we are on
	this.cell = getCellFromPxl(this.x,this.y);
	

	//Figure out if we have arrived at the target (this.pathcell+1)
	if (this.x == getPxlFromCell(pathlist[this.pathcell+1][0], pathlist[this.pathcell+1][1])[0] && this.y == getPxlFromCell(pathlist[this.pathcell+1][0], pathlist[this.pathcell+1][1])[1]) {
		//Enemy is there, so increment the this.pathcell pointer
		this.pathcell += 1;
	}
	
	//Figure out what direction the enemy needs to travel
	//Remember that there are no diagonal movements
	if (pathlist[this.pathcell+1][0] > pathlist[this.pathcell][0]) {
		document.getElementById("outputtri").innerHTML = "right";	
		//Go right
		this.x += 1;
	} else if (pathlist[this.pathcell+1][0] < pathlist[this.pathcell][0]) {
		document.getElementById("outputtri").innerHTML = "left";	
		//Go left
		this.x -= 1;
	} else if (pathlist[this.pathcell+1][1] > pathlist[this.pathcell][1]) {
		document.getElementById("outputtri").innerHTML = "down";	
		//Go down
		this.y += 1;
	} else if (pathlist[this.pathcell+1][1] < pathlist[this.pathcell][1]) {
		document.getElementById("outputtri").innerHTML = "up";	
		//Go up
		this.y -= 1;
	} else {
		//alert ("Enemy moving error!");
	}
}

function enemyDraw(can) {
	can.fillStyle = "#09" + Math.floor((this.health/this.totalhealth)*255).toString(16) + "65";
	can.fillRect(this.x, this.y, 10,10);
	return;
}

function addEnemy() {
	enemylist.push(new Enemy());
}	
