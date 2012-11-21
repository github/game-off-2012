package tests.color 
{
	import flash.display.BitmapData;
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ColorTest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "Colors 1";
		public static var description:String = "Demonstrates FlxColor.getRandomColor";
		private var instructions:String = "Demonstrates FlxColor.getRandomColor";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var canvas:FlxSprite;
		
		public function ColorTest1() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			canvas = new FlxSprite(32, 32).makeGraphic(256, 176, 0xff000000, true);
			canvas.drawLine(0, 0, canvas.width, 0, 0xffffffff);
			canvas.drawLine(0, canvas.height - 1, canvas.width, canvas.height - 1, 0xffffffff);
			
			add(canvas);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			//	Draw a randomly coloured box onto the canvas
			var data:BitmapData = canvas.pixels;
			
			data.fillRect(new Rectangle(FlxMath.rand(2, 236), FlxMath.rand(2, 156), 16, 16), FlxColor.getRandomColor(20));

			canvas.pixels = data;
		}
		
	}

}