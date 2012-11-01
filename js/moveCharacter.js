/*	Filename: testingGround.html
	Coded by: James Standeven for bit-phlippers
	Date: October 31, 2012
	Copyrighted
*/
/*  keyCode for a = 65
	keyCode for s = 83
	keyCode for d = 68
	keyCode for w = 87
	keyCode for e = 69
*/

function moveCharacter(evt) {
	/* alert('moveCharacter()'); */
	var evtobj = window.event? event : evt; 
	var unicode = evtobj.charCode? evtobj.charCode : evtobj.keyCode;
	direction = new Object();
	direction = {left:65, right:68, up:87, down:83} //setup direction object
	
	switch (unicode) {
		case direction.left:
			alert('left');
			break;
		case direction.right:
			alert('right');
			break;
		case direction.up:
			alert('up');
			break;
		case direction.down:
			alert('down');
			break;
		default:
			alert('default');
	}
}


