//Define some variables that may change
var width = 16;
var height = 16;
var spacing = 1;
var xcells = 20;
var ycells = 20;

//Global game variables
var towerarray = new Array();
var enemyarray = new Array();

var runInterval;

var money = 1000;
var score = 0;

var selectedtower = -1; // -1 signifies no tower selected

function fillSquare(x, y, can, fillstyle) {
	if (typeof(fillstyle) === 'undefined') {
		fillstyle = "#ffffff";
	}
	can.fillStyle = fillstyle;
	can.fillRect(width*x+spacing*x+spacing*(x+1), height*y+spacing*y+spacing*(y+1), width, height);
	return;
}

function drawSquare(x, y, can, style) {
	if (typeof(style) === 'undefined') {
		can.strokeStyle = "#00ff00";
	}
	can.strokeStyle = style;
	can.strokeRect(width*x+spacing*x+spacing*(x+1), height*y+spacing*y+spacing*(y+1), width, height);
	//can.fillStyle = "#000000";
	//can.fillRect(width*x+spacing*x+spacing*(x+1)+1, height*y+spacing*y+spacing*(y+1)+1, width-2, height-2);
	return;
}

function getCellFromPxl(x, y) {
	var clickLocation = new Object();
	clickLocation.xcell = Math.floor(x/(width+2*(spacing)));
	clickLocation.ycell = Math.floor(y/(height+2*(spacing)));
	//clickLocation.x = x;
	//clickLocation.y = y;
	return clickLocation;
}

function getPxlFromCell(cellx, celly) {
	var x = width*cellx+spacing*cellx+spacing*(cellx+1);
	var y = height*celly+spacing*celly+spacing*(celly+1);
	return [x,y];
}

var mouse = new (function () {
	this.pos = {};
	
	function findPos(event) {
		// Make mouse coordinates relative to canvas
		var x = event.pageX - document.getElementById("can").offsetLeft; 
		var y = event.pageY - document.getElementById("can").offsetTop;
		
		return {
			xcell: Math.floor(x / (width + 2*spacing)),
			ycell: Math.floor(y / (height + 2*spacing)),
			x: x,
			y: y,
		};
	}
	
	this.down = function down(event) {
		
	}
	this.click = function click(event) {
		var click = findPos(event);
		var i;
		
		// This is only necessary until we build a grid.
		var clickedtower = false;
		for (i = 0; i < towerarray.length; i++) {
			if (click.xcell == towerarray[i].x && click.ycell == towerarray[i].y) {
				//User clicked on tower
				selectedtower = i;
				clickedtower = true;
				break;
			}
		} 

		//See if user clicked on path
		var selectedpath;
		for (i = 0; i < pathlist.length; i++) {
			if (click.xcell == pathlist[i][0] && click.ycell == pathlist[i][1]) {
				selectedpath = pathlist[i];
				break;
			}
		}


		//Add tower if nothing selected
		if (clickedtower == false && selectedpath == undefined && money >= 100) {
			towerarray.push(new Tower(click.xcell, click.ycell));
			document.getElementById("sidebar").innerHTML = JSON.stringify(towerarray);
			money -= 100;
		}
		return;
	}

	this.move = function move(event) {
		this.pos = findPos(event);
		var pos = this.pos;
    /*
		document.getElementById("output").innerHTML =
			pos.xcell + ", " + pos.ycell + "\n"
			+ pos.x + ", " + pos.y;
      */
	}

});

function getKeypress(event) {
	return;
}

var enemyRate = 0.02;
function gameLoop(can) {
	//document.getElementById("sidebar").innerHTML = "00000";
	//Clear screen
	can.fillStyle = "#000000";
	can.fillRect(0,0,1000,1000);

	//Draw objects to canvas
	drawPath();
	for (i = 0; i < towerarray.length; i++) {
		towerarray[i].draw(can);
		towerarray[i].search(can);
		towerarray[i].mutate();
		if (i == selectedtower) {
			drawSquare(towerarray[i].x, towerarray[i].y, can, "#ff0000");
		}
	}
	for (i = 0; i < enemylist.length; i++) {
		enemylist[i].draw(can);
		enemylist[i].update();
		if (enemylist[i].health <= 0) {
			//Remove dead enemy
			enemylist.splice(i,1);
			
			//Get dead enemy money
			money += 10;

			//Add score
			score += 1;
		}
	}
	drawSquare(mouse.pos.x, mouse.pos.y, can);

	//document.getElementById("underbar").innerHTML = JSON.stringify(enemylist);
	document.getElementById("money").value = "Money: " + money;
	document.getElementById("sidebar").innerHTML = JSON.stringify(towerarray);
	document.getElementById("towerinfo").innerHTML = JSON.stringify(towerarray[selectedtower]);
	
	//enemyRate *= 1.0005;
	while (enemylist.length < 3000) {
		addEnemy();
	}
}

function main() {
	//Set width and height
	document.getElementById("can").height = (height + 2*spacing) * 20;
	document.getElementById("can").width = (width + 2*spacing) * 20;

	//Add event listeners
	document.getElementById("can").addEventListener("click", mouse.click, false);
	document.getElementById("can").addEventListener("mousemove", mouse.move, false);
	document.getElementById("can").addEventListener("keypress", getKeypress, false);

	c = document.getElementById("can").getContext("2d");
	c.rect(00,00,1000,1000);
	c.fillRect(0,0,1000,1000);

	runInterval = setInterval("gameLoop(c)", 30);
	genPathWrapper();

}
