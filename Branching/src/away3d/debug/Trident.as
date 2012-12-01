﻿package away3d.debug
{
	import away3d.core.base.Geometry;
	import away3d.debug.data.TridentLines;
	import away3d.entities.Mesh;
	import away3d.extrusions.LatheExtrude;
	import away3d.materials.ColorMaterial;
	import away3d.tools.commands.Merge;

	import flash.geom.Vector3D;

	/**
	 * Creates a new <code>Trident</code> object.
	 *
	 * @param	 length				The length of the trident axes. Default is 1000.
	 * @param	 showLetters		If the Trident should display the letters X, Y and Z at each axis arrows. Default is true.
	 */

	public class Trident extends Mesh
	{
		public function Trident(length:Number = 1000, showLetters:Boolean = true):void
		{
			super(new Geometry(), null);
			buildTrident(Math.abs((length == 0)? 10 : length), showLetters);
		}
		
		private function buildTrident(length:Number, showLetters:Boolean):void
		{
			var base:Number = length*.9;
			var rad:Number = 2.4;
			var offset:Number = length*.025;
			var vectors:Vector.<Vector.<Vector3D>> = new Vector.<Vector.<Vector3D>>();
			var colors:Vector.<uint> = Vector.<uint>([0xFF0000, 0x00FF00, 0x0000FF]);
			
			var matX:ColorMaterial = new ColorMaterial(0xFF0000);
			var matY:ColorMaterial = new ColorMaterial(0x00FF00);
			var matZ:ColorMaterial = new ColorMaterial(0x0000FF);
			var matOrigin:ColorMaterial = new ColorMaterial(0xCCCCCC);
			
			var merge:Merge = new Merge(true, true);
			
			var profileX:Vector.<Vector3D> = new Vector.<Vector3D>();
			profileX[0] = new Vector3D(length, 0 , 0);
			profileX[1] = new Vector3D(base, 0, offset);
			profileX[2] = new Vector3D(base, 0, -rad);
			vectors[0] = Vector.<Vector3D>([new Vector3D(0, 0, 0), new Vector3D(base, 0, 0) ]);
			var arrowX:LatheExtrude = new LatheExtrude(matX, profileX, LatheExtrude.X_AXIS, 1, 10);
			
			var profileY:Vector.<Vector3D> = new Vector.<Vector3D>();
			profileY[0] = new Vector3D(0, length, 0);
			profileY[1] = new Vector3D(offset, base, 0);
			profileY[2] = new Vector3D(-rad, base, 0);
			vectors[1] = Vector.<Vector3D>([new Vector3D(0, 0, 0), new Vector3D(0, base, 0) ]);
			var arrowY:LatheExtrude = new LatheExtrude(matY, profileY, LatheExtrude.Y_AXIS, 1, 10);
			 
			var profileZ:Vector.<Vector3D> = new Vector.<Vector3D>();
			vectors[2] = Vector.<Vector3D>([new Vector3D( 0, 0, 0), new Vector3D( 0, 0, base) ]);
			profileZ[0] = new Vector3D( 0, rad, base);
			profileZ[1] = new Vector3D( 0, offset, base);
			profileZ[2] = new Vector3D( 0 , 0, length);
			var arrowZ:LatheExtrude = new LatheExtrude(matZ, profileZ, LatheExtrude.Z_AXIS, 1, 10);
			
			var profileO:Vector.<Vector3D> = new Vector.<Vector3D>();
			profileO[0] = new Vector3D( 0 , rad, 0);
			profileO[1] = new Vector3D( -(rad*.7) , rad*.7, 0);
			profileO[2] = new Vector3D( -rad, 0, 0);
			profileO[3] = new Vector3D( -(rad*.7), -(rad*.7), 0);
			profileO[4] = new Vector3D( 0, -rad, 0);
			var origin:LatheExtrude = new LatheExtrude(matOrigin, profileO, LatheExtrude.Y_AXIS, 1, 10);
			
			merge.applyToMeshes(this, Vector.<Mesh>([arrowX, arrowY, arrowZ, origin]));
			
			if(showLetters){
				
				var scaleH:Number = length/10;
				var scaleW:Number = length/20;
				var scl1:Number = scaleW*1.5;
				var scl2:Number = scaleH*3;
				var scl3:Number = scaleH*2;
				var scl4:Number = scaleH*3.4;
				var cross:Number = length+(scl3) + (  ((length+scl4) - (length+scl3)) /3  * 2);
				
				//x
				vectors[3] = Vector.<Vector3D>([	new Vector3D(length+scl2, scl1 , 0),
												 					new Vector3D(length+scl3, -scl1 , 0),
																	new Vector3D(length+scl3, scl1 , 0),
																	new Vector3D(length+scl2, -scl1 , 0)] );
				//y
				vectors[4] = Vector.<Vector3D>([	new Vector3D(-scaleW*1.2, length+scl4,0),
																	new Vector3D( 0, cross, 0),
																	new Vector3D(scaleW*1.2, length+scl4,0),
																	new Vector3D( 0, cross, 0),
																	new Vector3D( 0, cross, 0),
																	new Vector3D( 0, length+scl3, 0)] );
				 
				//z
				vectors[5] = Vector.<Vector3D>([	new Vector3D(0, scl1, length+scl2),
																	new Vector3D(0, scl1, length+scl3),
																	new Vector3D(0, -scl1, length+scl2),
																	new Vector3D(0, -scl1, length+scl3),
																	new Vector3D(0, -scl1, length+scl3),
																	new Vector3D(0, scl1, length+scl2)] );
				
				colors.push(0xFF0000, 0x00FF00, 0x0000FF);
			}
			
			this.addChild(new TridentLines(vectors, colors));
		}
		 
	}
}