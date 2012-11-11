var pathlist = [[0,0]];
var debugpath = [[0,0,]];
function squareExists(propsq) {
	//Find out if a proposed square exists (generatePath) 
	//alert(propsq);
	for (i = 0; i < pathlist.length; i++) {
		if ((pathlist[i][0] == propsq[0]) && (pathlist[i][1] == propsq[1])) {
			//document.getElementById("outputsec").innerHTML += propsq + "is in list";
			return true; //Square exists
		}
	}
	return false; //square does not exist
}

function badNeighbours(sq) {
	//alert("badNe test with" + sq);
	var neighbourcount = 0; //Counter for how many neighbours proposed cell has
	var neighbours = []; // Neighbours of proposed square

	//Make sure the next square only has at most 1 neighbour (which would be currsq)
	//Find ajacent squares
	neighbours.push([sq[0]+1,sq[1]]);
	neighbours.push([sq[0]-1,sq[1]]);
	neighbours.push([sq[0],sq[1]+1]);
	neighbours.push([sq[0],sq[1]-1]);

	for (j = 0; j < neighbours.length; j++) {
		//alert("badNeigh call to sqexists" + j);
		if (squareExists(neighbours[j])) {
			neighbourcount += 1;
		}
	}
	//alert("Compare with"+ pathlist + "Neighbours:" + neighbours + "\n#:" + neighbourcount);
	if (neighbourcount == 1) {
		return false;
	} else {
		return true;
	}
}

function isNegative(propsq) {
	//Is square past top or left edges?
	if ((propsq[0] < 0) || (propsq[1] < 0)) {
		return true;
	} else {
		return false;
	}
}

function isEdge(propsq) {
	//Is square at bottom or right edge?
	if ((propsq[0] == xcells-1) || (propsq[1] == ycells-1)) {
		return true;
	} else {
		return false;
	}
}

function genPathRec(currsq) {
	//Generate path recursively
	
	//Check if it is the edge 
	if (isEdge(currsq)) {
		//It is! Search over. 
		//Push final edge value and begin return true going up the chain
		//alert("Edged!" + currsq);
		//alert(pathlist);
		pathlist.push(currsq); 
		return true;
	}

	//alert("Called with: " + currsq);
	var dir = Math.floor(Math.random()*3); //Use randomn for initial guess of propsq
	var tries = 0; //How many times has the following do/while loop been done
	var propsq = [];
	var popretry; //The next square was popped, flag to try again; indicates a retry is needed for propsq
	do {
		//Keep generating a square until proposed square does not cross path or make path go "back on itself"
		popretry = false; 
		tries += 1;
		if (dir == 0) {
			propsq = [currsq[0]+1,currsq[1]];
		} else if (dir == 1) {
			propsq = [currsq[0],currsq[1]+1];
		} else if (dir == 2) {
			propsq = [currsq[0]-1,currsq[1]];
		} else if (dir == 3) {
			propsq = [currsq[0],currsq[1]-1];
		} else {
			alert ("Error: Path gen rand failed");
		}
		//alert("propsq" + propsq);

		//alert("Testing " + propsq + "\nsqEx()=" + squareExists(propsq) + "\nbadNe()=" + badNeighbours(propsq) + "\nisNeg()=" +isNegative(propsq));
		if (!squareExists(propsq) && !badNeighbours(propsq) && !isNegative(propsq)) {
			//This square is good
			document.getElementById("outputsec").innerHTML += "going deeper!";
			//See if this path can lead us to the edge
			pathlist.push(propsq);
			debugpath.push(propsq);
			if (genPathRec(propsq)) {
				//This path leads us to the edge!
				return true;
			} else {
				//That path is bad, so lets undo that last push
				pathlist.pop(); 
				debugpath.push("popped - tries" + tries);
				popretry = true;
			}
		}

		
		dir = (dir + 1) % 4; //Don't waste cycles repeating over same numbers and just go to next
	} while ((squareExists(propsq) || badNeighbours(propsq) || isNegative(propsq) || popretry) && tries <= 4);
	return false; //This path direction will not be okay, back up one level and try again.
	
}

function drawPath() {
	//alert("drawing");
	var canv = document.getElementById("can").getContext("2d");
	for (k = 0; k < pathlist.length; k++) {
		fillSquare(pathlist[k][0], pathlist[k][1], canv, "#ffffff");
	}
}

function alertDebug() {
	alert(debugpath);
	return;
}

function genPathWrapper() {
	//Function to make a random path that starts on random square on top or left edge
	//Also makes sure that the path is at least certain length
	do {
		//Make a random start point on edge
		var randedge = Math.floor(Math.random() * 2);
		if (randedge == 0) {
			pathlist = [[Math.floor(Math.random() * Math.floor((xcells/2))), 0]];
		} else {
			pathlist = [[0, Math.floor(Math.random() * Math.floor(ycells/2))]];
		}

		//Call the pathgen function
		genPathRec(pathlist[0]);
	} while (pathlist.length < 50);
	return;
}

