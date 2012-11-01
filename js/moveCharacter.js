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
	trackTransforms(ctx);
	
	function redraw(){
		var origin = ctx.transformedPoint(0, 0); 
		var max = ctx.transformedPoint(bg.width, bg.height);
		ctx.clearRect(origin.x, origin.y, max.x - origin.x, max.y - origin.y);
		
		/*Load image here*/
		//ctx.drawImage(someImgVar, x , y);
		
		/*Start of Test Canvas*/
		ctx.fillStyle="#ffffff";
		ctx.fillRect(-100, 0, 400, 400);
		ctx.fillStyle="#00ff00";
		ctx.fillRect(400,0,200,400);
		/*End of Test Canvas*/
	}
	redraw() //initial draw on load of script
	
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
				redraw(); //update the image in the canvas
				break;
			case direction.right: //shift image left
				//alert('right');
				ctx.translate(right, 0); //shift
				redraw(); //update the image in the canvas
				break;
			case direction.up: //shift image down
				//alert('up'); 
				ctx.translate(0, up); //shift
				redraw(); //update the image in the canvas
				break;
			case direction.down: //shift image up
				//alert('down');
				ctx.translate(0, down); //shift
				redraw(); //update the image in the canvas
				break;
			default:
				//alert('default');
				//do nothing
		}
	}
}

/*This code is voodoo*/
function trackTransforms(ctx){

	var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
	var xform = svg.createSVGMatrix();
	ctx.getTransform = function(){ return xform; };
	
	var savedTransforms = [];
	var save = ctx.save;
	ctx.save = function(){
		savedTransforms.push(xform.translate(0,0));
		return save.call(ctx);
	};
	var restore = ctx.restore;
	ctx.restore = function(){
		xform = savedTransforms.pop();
		return restore.call(ctx);
	};

	var translate = ctx.translate;
	ctx.translate = function(dx,dy){
		xform = xform.translate(dx,dy);
		return translate.call(ctx,dx,dy);
	};
	var transform = ctx.transform;
	ctx.transform = function(a,b,c,d,e,f){
		var m2 = svg.createSVGMatrix();
		m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
		xform = xform.multiply(m2);
		return transform.call(ctx,a,b,c,d,e,f);
	};
	var setTransform = ctx.setTransform;
	ctx.setTransform = function(a,b,c,d,e,f){
		xform.a = a;
		xform.b = b;
		xform.c = c;
		xform.d = d;
		xform.e = e;
		xform.f = f;
		return setTransform.call(ctx,a,b,c,d,e,f);
	};
	var pt  = svg.createSVGPoint();
	ctx.transformedPoint = function(x,y){
		pt.x=x; pt.y=y;
		return pt.matrixTransform(xform.inverse());
	}
}
onkeydown=moveCharacter; //negates the need for an onkeydown in the html file