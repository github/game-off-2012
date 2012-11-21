package tests.gradient 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class GradientTest3 extends FlxState
	{
		//	Common variables
		public static var title:String = "Gradients 3";
		public static var description:String = "Gradient colours updated in real-time";
		private var instructions:String = "Gradient colours updated in real-time";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var timer:int;
		
		private var gradient1:FlxSprite;
		
		private var colourA:int;
		private var colourB:int;
		private var colourC:int;
		
		private var grad1:Array;
		private var grad2:Array;
		private var position:int;
		
		public function GradientTest3() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			//	Our 3 initial colours
			colourA = FlxColor.getRandomColor(50);
			colourB = FlxColor.getComplementHarmony(colourA);
			colourC = FlxColor.getRandomColor(50);
			
			//	The two gradients we'll move down
			grad1 = FlxGradient.createGradientArray(1, 176, [ colourA, colourB ], 4);
			grad2 = FlxGradient.createGradientArray(1, 176, [ colourB, colourC ], 4);
			
			position = 0;
			
			gradient1 = FlxGradient.createGradientFlxSprite(256, 176, [grad1[position], grad2[position]], 4);
			gradient1.x = 32;
			gradient1.y = 32;
			
			timer = 0;
			
			add(gradient1);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			position++;
			
			if (position == grad1.length - 1)
			{
				colourA = colourB;
				colourB = colourC;
				colourC = FlxColor.getRandomColor(50);
				
				grad1 = FlxGradient.createGradientArray(1, 176, [ colourA, colourB ], 4);
				grad2 = FlxGradient.createGradientArray(1, 176, [ colourB, colourC ], 4);
				
				position = 0;
			}
			
			FlxGradient.overlayGradientOnFlxSprite(gradient1, 256, 176, [grad1[position], grad2[position]], 0, 0, 4);
			
		}
		
	}

}