/*	Filename: moveCharacter.js
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
var bg = document.getElementById("bg"); //get canvas element

if(bg.getContext){ //execute if canvas element was present
	ctx = bg.getContext("2d");
	shiftCanvas(ctx);
	
	function redraw(ctx){
		var origin = ctx.transformPt(0, 0); 
		var max = ctx.transformPt(bg.width, bg.height);
		ctx.clearRect(origin.x, origin.y, max.x - origin.x, max.y - origin.y);
		
		/*Load image here*/
		//ctx.drawImage(someImgVar, x , y);
		
		/*Start of Test Canvas*/
		ctx.fillStyle="#ffffff";
		ctx.fillRect(-100, -100, 1600, 1200);
		ctx.fillStyle="#00ff00";
		ctx.fillRect(400, 0, 200, 400);
		ctx.fillRect(0, 0, 200, 800);
		/*End of Test Canvas*/
	}
	redraw(ctx) //initial draw on load of script
	
	function moveCharacter(evt) {
		/* alert('moveCharacter()'); */
		var evtobj = window.event? event : evt; //IE(window.event) FF(evt)
		var unicode = evtobj.charCode? evtobj.charCode : evtobj.keyCode;
		var charvalue=String.fromCharCode(unicode);
		
		direction = new Object();
		direction = {left:"A", right:"D", up:"W", down:"S"} //setup direction object

		var up;
		var down;
		var left = up = 10; //scroll speed 
		var right = down = -10; //scroll speed
		
		switch (charvalue) {
			case direction.left: //shift image right//scrolls left
				//alert('left');
				ctx.translate(left, 0); //shift//not visible untill the image is updated
				redraw(ctx); //update the image in the canvas
				break;
			case direction.right: //shift image left
				//alert('right');
				ctx.translate(right, 0); //shift
				redraw(ctx); //update the image in the canvas
				break;
			case direction.up: //shift image down
				//alert('up'); 
				ctx.translate(0, up); //shift
				redraw(ctx); //update the image in the canvas
				break;
			case direction.down: //shift image up
				//alert('down');
				ctx.translate(0, down); //shift
				redraw(ctx); //update the image in the canvas
				break;
			default:
				//alert('default');
				//do nothing
		}
	}
}

function shiftCanvas(ctx2){

	var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg'); //create an element using the svg namespace
	var xform = svg.createSVGMatrix(); //create a matrix for storing image data

	var translate = ctx2.translate;
	ctx2.translate = function(dx,dy){
		xform = xform.translate(dx,dy);
		return translate.call(ctx2,dx,dy);
	};

	var pt  = svg.createSVGPoint();
	ctx2.transformPt = function(x,y){
		pt.x=x; pt.y=y;
		return pt.matrixTransform(xform.inverse());
	}
}

onkeydown=moveCharacter; //negates the need for an onkeydown in the html file

