//vars for the whole sheet
var colCount	: int =  4;
var rowCount	: int =  4;
 
//vars for animation
var rowNumber	: int =  0; //Zero Indexed
var colNumber	: int =  0; //Zero Indexed
var totalCells	: int =  4;
var fps		: int = 10;
var offset	: Vector2;  //Maybe this should be a private var
 
//Update
function Update () { SetSpriteAnimation(colCount,rowCount,rowNumber,colNumber,totalCells,fps);  }
 
//SetSpriteAnimation
function SetSpriteAnimation(colCount : int,rowCount : int,rowNumber : int,colNumber : int,totalCells : int,fps : int){
 
	// Calculate index
	var index : int = Time.time * fps;
	// Repeat when exhausting all cells
	index = index % totalCells;
 
	// Size of every cell
	var size = Vector2 (1.0 / colCount, 1.0 / rowCount);
 
	// split into horizontal and vertical index
	var uIndex = index % colCount;
	var vIndex = index / colCount;
 
	// build offset
	// v coordinate is the bottom of the image in opengl so we need to invert.
	offset = Vector2 ((uIndex+colNumber) * size.x, (1.0 - size.y) - (vIndex+rowNumber) * size.y - 0.002);
 
	renderer.material.SetTextureOffset ("_MainTex", offset);
	renderer.material.SetTextureScale  ("_MainTex", size);
}