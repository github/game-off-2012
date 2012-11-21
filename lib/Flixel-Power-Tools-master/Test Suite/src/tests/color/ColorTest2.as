package tests.color 
{
	import flash.display.BitmapData;
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ColorTest2 extends FlxState
	{
		//	Common variables
		public static var title:String = "Colors 2";
		public static var description:String = "Using the HSV color wheel";
		private var instructions:String = "Using the HSV color wheel";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var hsv:Array;
		private var hsvIndex:int;
		private var canvas:FlxSprite;
		private var lastRect:Rectangle;
		
		public function ColorTest2() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			hsv = FlxColor.getHSVColorWheel();
			hsvIndex = 0;
			
			canvas = new FlxSprite(32, 32).makeGraphic(256, 176, 0xff000000, true);
			canvas.drawLine(0, 0, canvas.width, 0, 0xffffffff);
			canvas.drawLine(0, canvas.height - 1, canvas.width, canvas.height - 1, 0xffffffff);
			
			lastRect = new Rectangle(8, 8, 16, 16);
			
			add(canvas);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			if (hsvIndex < 360)
			{
				var data:BitmapData = canvas.pixels;
				
				data.fillRect(lastRect, hsv[hsvIndex]);

				canvas.pixels = data;
				
				lastRect.x += 8;
				
				if (lastRect.x >= 240)
				{
					lastRect.x = 8;
					lastRect.y += 12;
				}
				
				hsvIndex++;
			}
			
		}
		
	}

}